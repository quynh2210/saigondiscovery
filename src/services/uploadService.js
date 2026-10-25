/**
 * Dịch vụ tải ảnh và tệp âm thanh (Audio Guide) lên Cloudinary thông qua Upload Server (Node.js/Express)
 * Hỗ trợ các định dạng ảnh (jpg, png, webp, svg) và audio (mp3, wav, m4a, ogg, aac)
 */

const UPLOAD_SERVER_URL = import.meta.env.VITE_UPLOAD_SERVER_URL || "http://localhost:3000";

/**
 * Tải một file (ảnh hoặc âm thanh) lên Cloudinary
 * @param {File} file Đối tượng File được chọn từ input
 * @returns {Promise<string>} URL an toàn từ Cloudinary (https://res.cloudinary.com/...)
 */
export async function uploadFileToCloudinary(file) {
  if (!file) {
    throw new Error("Vui lòng chọn một file hợp lệ.");
  }

  // Giới hạn kích thước file (tối đa 50MB cho cả media ảnh và audio)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Kích thước file không được vượt quá 50MB.");
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`${UPLOAD_SERVER_URL}/upload`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Lỗi máy chủ tải file (HTTP ${response.status})`);
    }

    const data = await response.json();
    const finalUrl = data.url || data.imageUrl;
    if (!finalUrl) {
      throw new Error("Máy chủ không trả về URL tệp tải lên.");
    }

    return finalUrl;
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    if (err.message.includes("Failed to fetch") || err.name === "TypeError") {
      throw new Error(
        `Không thể kết nối đến Upload Server tại ${UPLOAD_SERVER_URL}. Vui lòng kiểm tra file server đang chạy!`
      );
    }
    throw err;
  }
}

export const uploadImageToCloudinary = uploadFileToCloudinary;
