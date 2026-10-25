import { app, isFirebaseConfigured } from "../lib/firebase";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { TOUR_GUIDE_SYSTEM_INSTRUCTION } from "./chatbotSystemInstruction";
import { buildTourismContextPrompt, formatConversationHistory } from "./chatbotContext";
import { extractActionFromAIResponse, validateAndBuildWebsiteAction } from "./chatbotActions";

// Lựa chọn mô hình Gemini tốc độ cao và chi phí tối ưu (Google AI Studio)
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || "gemini-3.5-flash-lite";
const DIRECT_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const REQUEST_TIMEOUT_MS = 14000; // 14 giây timeout

let cachedAI = null;
let cachedModel = null;
let aiInitializationError = null;

/**
 * Gọi trực tiếp Gemini API với cơ chế tự động thử mô hình khả dụng (Google AI Studio)
 */
async function callGeminiDirectApi({
  apiKey,
  modelName,
  systemInstruction,
  messageHistory,
  userPrompt,
  timeoutMs
}) {
  const candidateModels = Array.from(new Set([
    modelName || "gemini-3.5-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.5-flash",
    "gemini-3-flash-preview",
    "gemini-3.8-flash"
  ]));
  let lastError = null;

  for (const m of candidateModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;

    // Chuẩn hóa lịch sử hội thoại cho định dạng Gemini API
    const contents = [];
    const recentHistory = messageHistory.slice(-8);

    recentHistory.forEach((msg) => {
      if (msg.sender === "user") {
        contents.push({
          role: "user",
          parts: [{ text: msg.text || "" }]
        });
      } else if (msg.sender === "bot" && msg.text) {
        contents.push({
          role: "model",
          parts: [{ text: msg.text }]
        });
      }
    });

    // Đính kèm prompt người dùng cùng bối cảnh du lịch
    contents.push({
      role: "user",
      parts: [{ text: userPrompt }]
    });

    const requestBody = {
      contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600,
        thinkingConfig: { thinkingBudget: 0 }
      }
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      if (res.ok) {
        const data = await res.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText && candidateText.trim()) {
          console.info(`[Gemini AI] Response received successfully using model: ${m}`);
          return candidateText;
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        lastError = new Error(errData.error?.message || `Lỗi kết nối Gemini API (HTTP ${res.status})`);
        console.warn(`[Gemini API] Model ${m} unavailable (${res.status}), trying next candidate...`);
      }
    } catch (err) {
      lastError = err;
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError || new Error("Mô hình AI không phản hồi.");
}

/**
 * Khởi tạo Firebase AI Logic SDK và Model
 */
export function getChatbotAIModel() {
  if (cachedModel) return cachedModel;
  if (!isFirebaseConfigured || !app) {
    aiInitializationError = "Firebase chưa được cấu hình với API Key và Project ID hợp lệ.";
    return null;
  }

  try {
    if (!cachedAI) {
      cachedAI = getAI(app, {
        backend: new GoogleAIBackend()
      });
    }

    cachedModel = getGenerativeModel(cachedAI, {
      model: MODEL_NAME,
      systemInstruction: TOUR_GUIDE_SYSTEM_INSTRUCTION
    });

    console.info(`[Firebase AI Logic] Gemini Model (${MODEL_NAME}) initialized successfully.`);
    return cachedModel;
  } catch (err) {
    console.error("[Firebase AI Logic] Initialization error:", err);
    aiInitializationError = err.message;
    return null;
  }
}

/**
 * Gửi tin nhắn đến Gemini AI thông qua Direct API Key (Free) hoặc Firebase AI Logic SDK
 */
export async function sendChatMessageToAI({
  userMessage,
  messageHistory = [],
  places = [],
  venues = [],
  lang = "vi",
  activePlaceId = null
}) {
  const trimmed = String(userMessage || "").trim();
  if (!trimmed) {
    throw new Error("Tin nhắn trống.");
  }

  if (trimmed.length > 500) {
    throw new Error(
      lang === "vi"
        ? "Tin nhắn quá dài (tối đa 500 ký tự). Vui lòng rút ngắn câu hỏi của bạn."
        : "Message exceeds maximum length (500 characters). Please shorten your question."
    );
  }

  // 1. Tạo bối cảnh dữ liệu du lịch chính xác từ Firestore
  const tourismContext = buildTourismContextPrompt(places, venues, lang, activePlaceId);

  const promptWithContext = `
[CONTEXT_UPDATE]
${tourismContext}

[USER_QUESTION]
${trimmed}
`;

  let rawText = "";

  // PHƯƠNG ÁN 1: Nếu người dùng đã cài VITE_GEMINI_API_KEY (Free 100% từ Google AI Studio)
  if (DIRECT_GEMINI_API_KEY && DIRECT_GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY") {
    try {
      rawText = await callGeminiDirectApi({
        apiKey: DIRECT_GEMINI_API_KEY,
        modelName: MODEL_NAME,
        systemInstruction: TOUR_GUIDE_SYSTEM_INSTRUCTION,
        messageHistory,
        userPrompt: promptWithContext,
        timeoutMs: REQUEST_TIMEOUT_MS
      });
    } catch (directErr) {
      console.warn("[Direct Gemini API] Error, falling back to Firebase AI Logic:", directErr);
    }
  }

  // PHƯƠNG ÁN 2: Sử dụng Firebase AI Logic SDK chính thức
  if (!rawText) {
    const model = getChatbotAIModel();
    if (!model) {
      throw new Error(
        aiInitializationError ||
        "Chưa kích hoạt AI. Vui lòng thêm VITE_GEMINI_API_KEY vào .env hoặc bật Firebase AI Logic."
      );
    }

    const history = formatConversationHistory(messageHistory, 8);
    const chat = model.startChat({ history });

    const sendPromise = chat.sendMessage(promptWithContext);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(
          lang === "vi"
            ? "Phản hồi từ AI quá thời gian chờ (Timeout). Vui lòng thử lại hoặc dùng chế độ nhanh."
            : "AI response timed out. Please try again or use quick options."
        ));
      }, REQUEST_TIMEOUT_MS);
    });

    const result = await Promise.race([sendPromise, timeoutPromise]);
    rawText = result.response.text();
  }

  if (!rawText || !rawText.trim()) {
    throw new Error("AI không trả về nội dung.");
  }

  // Tách và phân tích hành động (Action)
  const { cleanedText, actionPayload } = extractActionFromAIResponse(rawText);

  // Kiểm tra và xác minh tính hợp lệ của hành động với dữ liệu Firestore
  let actionData = null;
  if (actionPayload) {
    actionData = validateAndBuildWebsiteAction(actionPayload, places, venues, lang);
  }

  return {
    text: cleanedText,
    actionData,
    isAIPowered: true,
    modelUsed: MODEL_NAME
  };
}
