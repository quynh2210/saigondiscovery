/**
 * Chuẩn hóa URL cho âm thanh / tài nguyên tĩnh trong web app.
 * Chuyển các đường dẫn như:
 * - "public/assets/audio/Attention.mp3" -> "/assets/audio/Attention.mp3"
 * - "/public/assets/audio/Attention.mp3" -> "/assets/audio/Attention.mp3"
 * - "assets/audio/Attention.mp3" -> "/assets/audio/Attention.mp3"
 * Giữ nguyên các URL: "https://...", "http://...", "data:...", "blob:..."
 */
export function normalizeAudioUrl(url) {
  if (!url || typeof url !== "string") return "";
  let trimmed = url.trim().replace(/^["']|["']$/g, "").trim();
  if (!trimmed) return "";

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  // Loại bỏ tiền tố "public/" hoặc "/public/"
  let normalized = trimmed.replace(/^\/?public\//, "/");
  if (!normalized.startsWith("/")) {
    normalized = "/" + normalized;
  }
  return normalized;
}

export const normalizeAssetUrl = normalizeAudioUrl;
