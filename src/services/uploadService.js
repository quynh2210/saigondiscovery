/**
 * Dịch vụ tải ảnh, video và tệp âm thanh lên Cloudinary.
 * Hỗ trợ 2 cơ chế:
 * 1. Tải trực tiếp (Direct Upload) qua Cloudinary REST API trên trình duyệt (hoạt động 100% trên Vercel/Firebase/di động).
 * 2. Tải qua Upload Server (Node.js/Express cục bộ) khi chạy trong môi trường phát triển local.
 */

const UPLOAD_SERVER_URL = import.meta.env.VITE_UPLOAD_SERVER_URL || "http://localhost:3000";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_NAME || "di7xar1oz";
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || "527646629682775";
const API_SECRET = import.meta.env.VITE_CLOUDINARY_SECRET_KEY || "E5xedysf1e9g8fTEyrBHC3DKC68";

/**
 * Tính toán mã băm SHA-1 cho chữ ký Cloudinary bằng Web Crypto API tiêu chuẩn W3C
 */
async function computeSha1(message) {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  throw new Error("Web Crypto API không được hỗ trợ trên trình duyệt này.");
}

/**
 * Tải trực tiếp file lên Cloudinary qua REST API (không cần Node server trung gian)
 */
async function uploadDirectToCloudinary(file) {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = "covers";

  // Chuỗi tham số ký của Cloudinary: sắp xếp theo alphabet + api_secret
  const toSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
  const signature = await computeSha1(toSign);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", API_KEY);
  formData.append("timestamp", timestamp.toString());
  formData.append("folder", folder);
  formData.append("signature", signature);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
  const response = await fetch(endpoint, {
    method: "POST",
    body: formData
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error?.message || `Lỗi tải lên Cloudinary (HTTP ${response.status})`;
    throw new Error(errorMsg);
  }

  const finalUrl = data.secure_url || data.url;
  if (!finalUrl) {
    throw new Error("Cloudinary không trả về URL tệp tải lên.");
  }

  return finalUrl;
}

/**
 * Tải file (ảnh, âm thanh, video) lên Cloudinary
 * Tự động ưu tiên tải trực tiếp lên Cloudinary CDN để chạy mượt mà trên Vercel/Firebase.
 * @param {File} file Đối tượng File được chọn từ input
 * @returns {Promise<string>} URL an toàn từ Cloudinary (https://res.cloudinary.com/...)
 */
export async function uploadFileToCloudinary(file) {
  if (!file) {
    throw new Error("Vui lòng chọn một file hợp lệ.");
  }

  // Giới hạn kích thước file tối đa 50MB
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Kích thước file không được vượt quá 50MB.");
  }

  // Bước 1: Ưu tiên tải trực tiếp qua Cloudinary REST API (Hoạt động tốt 100% trên Vercel/Firebase)
  try {
    const directUrl = await uploadDirectToCloudinary(file);
    return directUrl;
  } catch (directErr) {
    console.warn("Direct Cloudinary upload failed, falling back to local server:", directErr.message);

    // Bước 2: Dự phòng qua Local Express Server (nếu người dùng đang chạy máy chủ cục bộ)
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${UPLOAD_SERVER_URL}/upload`, {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const serverUrl = data.url || data.imageUrl;
        if (serverUrl) return serverUrl;
      }
    } catch {
      // Bỏ qua lỗi fallback server, trả về lỗi chi tiết của Cloudinary
    }

    throw new Error(`Lỗi tải file lên Cloudinary: ${directErr.message}`);
  }
}

export const uploadImageToCloudinary = uploadFileToCloudinary;
