import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  Send, 
  RotateCcw, 
  Minimize2, 
  Sparkles,
  Loader2, 
  AlertCircle 
} from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { getPublishedPlaces } from "../services/placeService";
import { getPublishedVenues } from "../services/venueService";
import { getSiteContent } from "../services/siteContentService";
import { normalizeAssetUrl } from "../utils/mediaUtils";
import { sendChatMessageToAI } from "../chatbot/chatbotAIService";
import { processFallbackChatTurn } from "../chatbot/chatbotFallback";
import { analyzeUserIntent } from "../chatbot/chatbotIntents";
import { createPlaceIntroMessage, createHistoryMessage } from "../chatbot/chatbotFlows";
import ChatMessageList from "../chatbot/ChatMessageList";
import QRCodeModal from "./QRCodeModal";

export default function ChatbotWidget({ currentWebPlace, onSelectPlaceOnMap }) {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(() => {
    try {
      return localStorage.getItem("hcmc_chatbot_open") === "true";
    } catch {
      return false;
    }
  });
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [referencePlaceId, setReferencePlaceId] = useState(() => {
    try {
      return localStorage.getItem("hcmc_chatbot_ref_place") || null;
    } catch {
      return null;
    }
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("hcmc_chatbot_messages");
      if (saved) {
        let parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Tự động chuẩn hóa các tùy chọn cũ (như Dinh Độc Lập thành Khám phá địa điểm)
          parsed = parsed.map((msg) => {
            if (msg.options && Array.isArray(msg.options)) {
              return {
                ...msg,
                options: msg.options.map((opt) => {
                  if (opt.label && (opt.label.includes("Dinh Độc Lập") || opt.label.includes("Independence Palace"))) {
                    return {
                      id: "opt-explore-places",
                      label: lang === "vi" ? "🏛️ Khám phá địa điểm" : "🏛️ Explore Landmarks",
                      flow: "LEARN_PLACE"
                    };
                  }
                  return opt;
                })
              };
            }
            return msg;
          });
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [
      {
        id: "msg-welcome",
        sender: "bot",
        text:
          lang === "vi"
            ? "Xin chào! Mình là Plunis — Trợ lý hướng dẫn viên du lịch Sài Gòn. Hôm nay bạn muốn khám phá địa danh lịch sử nào hay tìm một quán ăn ngon?"
            : "Hello! I'm Plunis, your Saigon tour guide assistant. Which historic landmark or local cuisine would you like to explore today?",
        isAIPowered: true,
        options: [
          { id: "opt-explore-places", label: lang === "vi" ? "🏛️ Khám phá địa điểm" : "🏛️ Explore Landmarks", flow: "LEARN_PLACE" },
          { id: "opt-food", label: lang === "vi" ? "🍜 Quán ăn ngon" : "🍜 Food Suggestions", action: "FOOD_MENU" },
          { id: "opt-all", label: lang === "vi" ? "🗺️ Mở bản đồ" : "🗺️ Open Map", action: "OPEN_MAP" }
        ]
      }
    ];
  });

  const [mascotSrc, setMascotSrc] = useState("/assets/mascot/guide-mascot.svg");
  const [places, setPlaces] = useState([]);
  const [venues, setVenues] = useState([]);

  // Tự động lưu lịch sử tin nhắn & trạng thái vào localStorage
  useEffect(() => {
    if (messages && messages.length > 0) {
      try {
        localStorage.setItem("hcmc_chatbot_messages", JSON.stringify(messages));
      } catch {
        // ignore
      }
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem("hcmc_chatbot_open", isOpen ? "true" : "false");
    } catch {
      // ignore
    }
  }, [isOpen]);

  useEffect(() => {
    if (referencePlaceId) {
      try {
        localStorage.setItem("hcmc_chatbot_ref_place", referencePlaceId);
      } catch {
        // ignore
      }
    }
  }, [referencePlaceId]);

  // QR Modal State
  const [qrModalData, setQrModalData] = useState(null);

  const messagesEndRef = useRef(null);

  // Tải dữ liệu địa điểm & quán ăn cho chatbot
  useEffect(() => {
    Promise.all([getPublishedPlaces(), getPublishedVenues()]).then(([placesData, venuesData]) => {
      setPlaces(placesData);
      setVenues(venuesData);
    });

    // Lắng nghe cập nhật khi quản trị viên thêm/xóa địa điểm
    const handlePlacesUpdated = () => {
      getPublishedPlaces().then(setPlaces);
      getPublishedVenues().then(setVenues);
    };
    window.addEventListener("hcmc:places-updated", handlePlacesUpdated);
    return () => window.removeEventListener("hcmc:places-updated", handlePlacesUpdated);
  }, []);

  // Tải ảnh mascot tùy biến từ siteContent
  useEffect(() => {
    getSiteContent().then((content) => {
      if (content?.mascotImageUrl) {
        setMascotSrc(normalizeAssetUrl(content.mascotImageUrl));
      }
    });

    const handleContentUpdate = (e) => {
      if (e.detail?.mascotImageUrl) {
        setMascotSrc(normalizeAssetUrl(e.detail.mascotImageUrl));
      }
    };

    window.addEventListener("hcmc:site-content-updated", handleContentUpdate);
    return () => window.removeEventListener("hcmc:site-content-updated", handleContentUpdate);
  }, []);

  // Cập nhật địa điểm tham chiếu khi người dùng chuyển trang trên website
  useEffect(() => {
    if (currentWebPlace?.id) {
      setReferencePlaceId(currentWebPlace.id);
    }
  }, [currentWebPlace]);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isProcessing]);

  // Gửi tin nhắn đến Trợ lý (Phân luồng 2 Trường hợp: Dữ liệu từ khóa sẵn có HOẶC Gemini AI)
  const handleSendMessage = async (e, customText = null) => {
    e?.preventDefault();
    const userText = (customText || inputText).trim();
    if (!userText || isProcessing) return;

    if (!customText) {
      setInputText("");
    }

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userText
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    // TRƯỜNG HỢP 1: Kiểm tra Intent từ khóa với thông tin sẵn có từ Firestore / Admin
    // (VD: "quán ăn gần lê quý đôn", "địa chỉ dinh độc lập", "nghe audio", "quán cafe", "lịch sử", "danh sách địa điểm"...)
    // Trả lời NGAY LẬP TỨC từ dữ liệu có sẵn, không mất thời gian suy nghĩ hay gọi API bên ngoài!
    const matchedIntent = analyzeUserIntent(
      userText,
      places,
      { selectedPlace: places.find((p) => p.id === referencePlaceId) }
    );

    if (matchedIntent.type !== "UNKNOWN") {
      try {
        const keywordResult = await processFallbackChatTurn(
          userText,
          null,
          { selectedPlace: places.find((p) => p.id === referencePlaceId) },
          places,
          venues,
          lang
        );

        if (keywordResult?.responseMessages?.length > 0) {
          const firstMsg = keywordResult.responseMessages[0];
          if (firstMsg?.actionData?.placeId) {
            setReferencePlaceId(firstMsg.actionData.placeId);
          }
          if (firstMsg?.actionData?.type === "SHOW_PLACE" && onSelectPlaceOnMap) {
            onSelectPlaceOnMap(firstMsg.actionData.placeId);
          }
          setMessages((prev) => [...prev, ...keywordResult.responseMessages]);
          setIsProcessing(false);
          return;
        }
      } catch (kwErr) {
        console.warn("Keyword handling error, fallback to AI:", kwErr);
      }
    }

    // TRƯỜNG HỢP 2: Người dùng hỏi câu hỏi tự nhiên ngoài từ khóa ("bạn chán không", "bạn là ai", "bạn có đang rảnh không",...)
    // Gọi Gemini AI thông minh (mô hình gemini-3.5-flash-lite phản hồi trong ~1s, hỗ trợ cả tiếng Anh)
    try {
      const aiResponse = await sendChatMessageToAI({
        userMessage: userText,
        messageHistory: messages,
        places,
        venues,
        lang,
        activePlaceId: referencePlaceId
      });

      if (aiResponse.actionData?.placeId) {
        setReferencePlaceId(aiResponse.actionData.placeId);
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: aiResponse.text,
        actionData: aiResponse.actionData,
        isAIPowered: true
      };

      setMessages((prev) => [...prev, botMsg]);

      // Nếu hành động là SHOW_PLACE và có callback bản đồ
      if (aiResponse.actionData?.type === "SHOW_PLACE" && onSelectPlaceOnMap) {
        onSelectPlaceOnMap(aiResponse.actionData.placeId);
      }
    } catch (err) {
      console.warn("AI generation failed or unavailable, using fallback:", err);

      // Dự phòng an toàn nếu mất kết nối mạng hoặc lỗi ngoại lệ
      const fallbackResult = await processFallbackChatTurn(
        userText,
        null,
        { selectedPlace: places.find((p) => p.id === referencePlaceId) },
        places,
        venues,
        lang
      );

      setMessages((prev) => [...prev, ...fallbackResult.responseMessages]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Xử lý khi bấm nút chọn nhanh (Options / Buttons)
  const handleOptionClick = async (option) => {
    if (isProcessing) return;

    // 1. Liên kết ngoài hoặc URL trực tiếp
    if (option.action === "EXTERNAL_LINK" && option.url) {
      if (option.url.startsWith("#/")) {
        window.location.hash = option.url;
      } else {
        window.open(option.url, "_blank", "noopener,noreferrer");
      }
      return;
    }

    // 2. Xem trên bản đồ (link vào bản đồ trong web)
    if (option.action === "SHOW_ON_MAP" && option.placeId) {
      if (onSelectPlaceOnMap) {
        onSelectPlaceOnMap(option.placeId);
      } else {
        window.location.hash = `#/map?placeId=${option.placeId}`;
      }
      setIsOpen(false);
      return;
    }

    if (option.action === "OPEN_MAP") {
      window.location.hash = "#/map";
      setIsOpen(false);
      return;
    }

    // 3. Xem đầy đủ chi tiết hoặc các tab lịch sử / quán ăn
    if (option.action === "NAVIGATE_DETAIL" && option.placeId) {
      const tabParam = option.tab ? `?tab=${option.tab}` : "";
      window.location.hash = `#/places/${option.placeId}${tabParam}`;
      setIsOpen(false);
      return;
    }

    // 4. Nghe thuyết minh Audio Guide (Gửi audio của địa điểm đó vào tin nhắn)
    if (option.action === "PLAY_AUDIO") {
      const targetId = option.placeId || referencePlaceId;
      const targetPlace = places.find((p) => p.id === targetId) || (currentWebPlace?.id === targetId ? currentWebPlace : null);
      if (targetPlace) {
        setReferencePlaceId(targetPlace.id);
        const placeName = targetPlace.name?.[lang] || targetPlace.name?.vi || targetPlace.id;
        const audioData = targetPlace.audioGuide || targetPlace.audioUrl;

        const userEcho = {
          id: `user-${Date.now()}`,
          sender: "user",
          text: option.label || (lang === "vi" ? `🎧 Nghe thuyết minh ${placeName}` : `🎧 Listen to ${placeName}`)
        };

        const botReply = {
          id: `bot-audio-${Date.now()}`,
          sender: "bot",
          text: audioData
            ? (lang === "vi"
                ? `Dưới đây là bài thuyết minh âm thanh chính thức cho **${placeName}**. Bạn có thể bấm phát và nghe trực tiếp ngay tại đây:`
                : `Here is the official audio narration for **${placeName}**. Play and listen directly below:`)
            : (lang === "vi"
                ? `Địa danh **${placeName}** hiện chưa cập nhật file ghi âm thuyết minh. Bạn có thể xem thông tin lịch sử hoặc mở bản đồ bên dưới nhé!`
                : `Audio narration for **${placeName}** is currently being updated. You can explore history or map below:`),
          actionData: audioData
            ? {
                type: "PLAY_AUDIO_GUIDE",
                audioData,
                placeName
              }
            : null,
          options: [
            { id: "opt-food", label: lang === "vi" ? "🍜 Quán ăn quanh đây" : "🍜 Food nearby", action: "FOOD_MENU", placeId: targetPlace.id },
            { id: "opt-map", label: lang === "vi" ? "🗺️ Xem trên bản đồ" : "🗺️ Show on Map", action: "SHOW_ON_MAP", placeId: targetPlace.id },
            { id: "opt-det", label: lang === "vi" ? "📖 Xem đầy đủ chi tiết" : "📖 Full Details", action: "NAVIGATE_DETAIL", placeId: targetPlace.id },
            { id: "opt-other", label: lang === "vi" ? "🔄 Chọn địa điểm khác" : "🔄 Other Place", action: "LIST_PLACES_FOR_AUDIO" }
          ]
        };

        setMessages((prev) => [...prev, userEcho, botReply]);
        return;
      }
    }

    // 5. Hiển thị Địa chỉ của địa điểm
    if (option.action === "SHOW_ADDRESS" && option.placeId) {
      const targetPlace = places.find((p) => p.id === option.placeId);
      if (targetPlace) {
        setReferencePlaceId(targetPlace.id);
        const placeName = targetPlace.name?.[lang] || targetPlace.name?.vi || targetPlace.id;
        const address = targetPlace.address?.[lang] || targetPlace.address?.vi || targetPlace.address?.en || "Đang cập nhật";

        const userEcho = {
          id: `user-${Date.now()}`,
          sender: "user",
          text: option.label || `Địa chỉ của ${placeName}`
        };

        const addrMsg = {
          id: `bot-addr-${Date.now()}`,
          sender: "bot",
          text: lang === "vi"
            ? `📍 **Địa chỉ của ${placeName}:**\n**${address}**\n\nBạn có thể mở bản đồ chỉ đường hoặc nghe thuyết minh bên dưới:`
            : `📍 **Address of ${placeName}:**\n**${address}**\n\nYou can open map directions or listen to audio below:`,
          actionData: {
            type: "SHOW_PLACE",
            placeId: targetPlace.id
          },
          options: [
            { id: "opt-map", label: lang === "vi" ? "🗺️ Xem trên bản đồ" : "🗺️ Show on Map", action: "SHOW_ON_MAP", placeId: targetPlace.id },
            { id: "opt-food", label: lang === "vi" ? "🍜 Quán ăn gần đây" : "🍜 Food nearby", action: "FOOD_MENU", placeId: targetPlace.id },
            { id: "opt-audio", label: lang === "vi" ? "🎧 Nghe thuyết minh" : "🎧 Listen to Audio", action: "PLAY_AUDIO", placeId: targetPlace.id },
            { id: "opt-det", label: lang === "vi" ? "📖 Xem chi tiết" : "📖 Full Details", action: "NAVIGATE_DETAIL", placeId: targetPlace.id }
          ]
        };

        setMessages((prev) => [...prev, userEcho, addrMsg]);
        return;
      }
    }

    // 6. Lịch sử di tích
    if (option.action === "SHOW_HISTORY") {
      const targetId = option.placeId || referencePlaceId;
      const targetPlace = places.find((p) => p.id === targetId) || (currentWebPlace?.id === targetId ? currentWebPlace : null);
      if (targetPlace) {
        const userEcho = {
          id: `user-${Date.now()}`,
          sender: "user",
          text: option.label || (lang === "vi" ? "Lịch sử di tích" : "Monument history")
        };
        const historyMsg = createHistoryMessage(targetPlace, lang);
        setMessages((prev) => [...prev, userEcho, historyMsg]);
        return;
      }
    }

    // 7. Quán ăn & cà phê gần đây
    if (option.action === "FOOD_NEAR_PLACE" || option.action === "FOOD_MENU" || option.action === "DRINK_MENU") {
      const targetId = option.placeId || referencePlaceId;
      const targetPlace = places.find((p) => p.id === targetId) || (currentWebPlace?.id === targetId ? currentWebPlace : null);
      const isDrink = option.action === "DRINK_MENU";

      const userEcho = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: option.label || (lang === "vi" ? (isDrink ? "Quán cà phê gần đây" : "Quán ăn gần đây") : (isDrink ? "Cafes nearby" : "Food nearby"))
      };

      if (targetPlace) {
        setReferencePlaceId(targetPlace.id);
        const placeName = targetPlace.name?.[lang] || targetPlace.name?.vi || targetPlace.id;
        const linked = venues.filter((v) =>
          Array.isArray(v.placeIds) && v.placeIds.includes(targetPlace.id) && (isDrink ? v.type === "drink" : (v.type === "restaurant" || !v.type))
        );

        const foodMsg = {
          id: `bot-food-${Date.now()}`,
          sender: "bot",
          text: lang === "vi"
            ? `Dưới đây là một số ${isDrink ? "quán cà phê & nước" : "quán ăn ngon"} tiêu biểu quanh **${placeName}**:`
            : `Here are popular ${isDrink ? "cafes & drink spots" : "eateries"} around **${placeName}**:`,
          actionData: {
            type: "RECOMMEND_VENUES",
            placeId: targetPlace.id,
            placeName,
            venues: linked.length > 0 ? linked.slice(0, 4) : venues.slice(0, 4)
          },
          options: [
            { id: "opt-food-tab", label: lang === "vi" ? "🍽️ Xem trang ẩm thực liên kết" : "🍽️ View in Food Tab", action: "NAVIGATE_DETAIL", placeId: targetPlace.id, tab: "food" },
            { id: "opt-audio", label: lang === "vi" ? "🎧 Nghe thuyết minh" : "🎧 Listen to Audio", action: "PLAY_AUDIO", placeId: targetPlace.id },
            { id: "opt-map", label: lang === "vi" ? "🗺️ Xem trên bản đồ" : "🗺️ Show on Map", action: "SHOW_ON_MAP", placeId: targetPlace.id },
            { id: "opt-other", label: lang === "vi" ? "🔄 Chọn địa điểm khác" : "🔄 Other place", action: isDrink ? "LIST_PLACES_FOR_DRINK" : "LIST_PLACES_FOR_FOOD" }
          ]
        };
        setMessages((prev) => [...prev, userEcho, foodMsg]);
        return;
      }
    }

    // 8. Chọn địa điểm cụ thể (Intro Place)
    if ((option.action === "SELECT_PLACE" || option.action === "INTRO_PLACE") && option.placeId) {
      const targetPlace = places.find((p) => p.id === option.placeId);
      if (targetPlace) {
        setReferencePlaceId(targetPlace.id);
        const userEcho = {
          id: `user-${Date.now()}`,
          sender: "user",
          text: option.label || targetPlace.name?.[lang] || targetPlace.name?.vi
        };
        const introMsg = createPlaceIntroMessage(targetPlace, lang);
        setMessages((prev) => [...prev, userEcho, introMsg]);
        return;
      }
    }

    // 9. Danh sách tất cả địa điểm (Đầy đủ cả 12 địa điểm từ Admin / Firestore)
    if (
      option.flow === "LEARN_PLACE" ||
      option.action === "LIST_ALL_PLACES" ||
      option.action === "LIST_PLACES_FOR_FOOD" ||
      option.action === "LIST_PLACES_FOR_AUDIO" ||
      option.action === "LIST_PLACES_FOR_DRINK" ||
      option.action === "LIST_PLACES_FOR_ADDRESS"
    ) {
      const isAudio = option.action === "LIST_PLACES_FOR_AUDIO";
      const isFood = option.action === "LIST_PLACES_FOR_FOOD";
      const isDrink = option.action === "LIST_PLACES_FOR_DRINK";
      const isAddress = option.action === "LIST_PLACES_FOR_ADDRESS";

      const targetAction = isAudio
        ? "PLAY_AUDIO"
        : isFood
        ? "FOOD_MENU"
        : isDrink
        ? "DRINK_MENU"
        : isAddress
        ? "SHOW_ADDRESS"
        : "SELECT_PLACE";

      const prefix = isAudio ? "🎧" : isFood ? "🍜" : isDrink ? "☕" : isAddress ? "📍" : "🏛️";

      const userEcho = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: option.label || (lang === "vi" ? "Khám phá địa điểm" : "Explore places")
      };

      const listMsg = {
        id: `bot-list-${Date.now()}`,
        sender: "bot",
        text: lang === "vi"
          ? (isAudio
              ? "Bạn muốn nghe thuyết minh của địa danh nào? Hãy chọn một địa điểm dưới đây:"
              : isFood
              ? "Bạn muốn tìm quán ăn gần địa danh nào? Hãy chọn bên dưới:"
              : isDrink
              ? "Bạn muốn tìm quán nước/cafe gần địa danh nào? Hãy chọn bên dưới:"
              : isAddress
              ? "Bạn muốn xem địa chỉ của địa danh nào? Hãy chọn bên dưới:"
              : `Dưới đây là đầy đủ ${places.length || 12} địa điểm du lịch & di tích lịch sử nổi tiếng tại TP.HCM. Bạn muốn tìm hiểu nơi nào?`)
          : (isAudio
              ? "Which landmark's audio guide would you like to listen to? Pick one below:"
              : isFood
              ? "Near which landmark are you looking for food? Pick one below:"
              : isDrink
              ? "Near which landmark are you looking for cafes? Pick one below:"
              : isAddress
              ? "Which landmark's address would you like to see? Pick one below:"
              : `Here are all ${places.length || 12} famous tourist landmarks in Saigon. Which one would you like to explore?`),
        // Hiển thị ĐẦY ĐỦ tất cả địa điểm có trong hệ thống (không bị cắt bớt)
        options: places.map((p) => ({
          id: `btn-${targetAction}-${p.id}`,
          label: `${prefix} ${p.name?.[lang] || p.name?.vi || p.id}`,
          action: targetAction,
          placeId: p.id
        }))
      };
      setMessages((prev) => [...prev, userEcho, listMsg]);
      return;
    }

    // 10. Menu chính / Làm mới
    if (option.flow === "MAIN_MENU") {
      handleResetChat();
      return;
    }

    // 11. Mặc định: Gửi câu hỏi theo nhãn nút
    handleSendMessage(null, option.label);
  };

  // Làm mới cuộc trò chuyện
  const handleResetChat = () => {
    setReferencePlaceId(null);
    try {
      localStorage.removeItem("hcmc_chatbot_messages");
      localStorage.removeItem("hcmc_chatbot_ref_place");
    } catch {
      // ignore
    }
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: "bot",
        text:
          lang === "vi"
            ? "Cuộc trò chuyện đã được làm mới! Bạn muốn tìm hiểu về địa điểm du lịch nào hay tìm quán ăn ngon hôm nay?"
            : "Chat conversation refreshed! Which historic landmark or local food would you like to explore today?",
        isAIPowered: true,
        options: [
          { id: "opt-explore-places", label: lang === "vi" ? "🏛️ Khám phá địa điểm" : "🏛️ Explore Landmarks", flow: "LEARN_PLACE" },
          { id: "opt-food", label: lang === "vi" ? "🍜 Quán ăn ngon" : "🍜 Food Suggestions", action: "FOOD_MENU" },
          { id: "opt-all", label: lang === "vi" ? "🗺️ Mở bản đồ" : "🗺️ Open Map", action: "OPEN_MAP" }
        ]
      }
    ]);
  };

  return (
    <div className="chatbot-widget-root">
      {/* Floating Mascot Button */}
      {!isOpen && (
        <button
          type="button"
          className="mascot-launcher-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open tour guide chatbot"
        >
          <div className="mascot-avatar-pulse"></div>
          <img
            src={mascotSrc}
            alt={t("mascotName")}
            className="mascot-launcher-img"
          />
          <div className="launcher-badge">
            <Sparkles size={12} />
            <span>AI Chat</span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <img
                src={mascotSrc}
                alt={t("mascotName")}
                className="chat-header-mascot"
              />
              <div className="header-titles">
                <span className="chat-bot-name">Plunis</span>
                <span className="chat-bot-role">
                  {lang === "vi" ? "Trợ lý Du lịch" : "Tour Assistant"}
                </span>
              </div>
            </div>

            <div className="chat-header-actions">
              <button
                type="button"
                className="chat-header-icon-btn"
                onClick={handleResetChat}
                title={lang === "vi" ? "Làm mới hội thoại" : "New conversation"}
              >
                <RotateCcw size={17} />
              </button>
              <button
                type="button"
                className="chat-header-icon-btn"
                onClick={() => setIsOpen(false)}
                title={lang === "vi" ? "Thu nhỏ" : "Minimize"}
              >
                <Minimize2 size={17} />
              </button>
              <button
                type="button"
                className="chat-header-icon-btn"
                onClick={() => setIsOpen(false)}
                title={lang === "vi" ? "Đóng" : "Close"}
              >
                <X size={19} />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <ChatMessageList
            messages={messages}
            mascotSrc={mascotSrc}
            onOptionClick={handleOptionClick}
            onShowQrModal={(qrData, placeName) => setQrModalData({ qrData, placeName })}
            lang={lang}
          />

          {/* Typing Indicator */}
          {isProcessing && (
            <div className="chat-bubble-row bot-row" style={{ padding: "0 1.25rem 0.5rem" }}>
              <img src={mascotSrc} alt="Plunis" className="chat-avatar-img" />
              <div className="chat-bubble bot-bubble typing-bubble">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="typing-text">
                  {lang === "vi" ? "Plunis đang suy nghĩ..." : "Plunis is thinking..."}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />

          {/* Input Bar */}
          <div className="chat-input-container">
            <form onSubmit={handleSendMessage} className="chat-input-bar">
              <input
                type="text"
                value={inputText}
                maxLength={500}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  lang === "vi"
                    ? "Hỏi tự nhiên về địa điểm, ăn uống, lịch sử..."
                    : "Ask freely about sights, history, food..."
                }
                disabled={isProcessing}
                className="chat-input-field"
              />
              <button
                type="submit"
                disabled={isProcessing || !inputText.trim()}
                className="chat-send-btn"
                aria-label="Send message"
              >
                {isProcessing ? (
                  <Loader2 size={18} className="spinning-loader" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </form>
            {inputText.length > 300 && (
              <div className="input-char-counter">
                {inputText.length}/500
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR Code Modal nếu người dùng yêu cầu xem */}
      {qrModalData && (
        <QRCodeModal
          qrData={qrModalData.qrData}
          placeName={qrModalData.placeName}
          onClose={() => setQrModalData(null)}
        />
      )}
    </div>
  );
}
