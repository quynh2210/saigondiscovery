/**
 * Quản lý ngữ cảnh và dữ liệu Firestore cung cấp cho Gemini AI
 * Chỉ trích xuất thông tin cần thiết, ngắn gọn, chuẩn xác.
 */

/**
 * Xây dựng chuỗi dữ liệu du lịch chính xác từ danh sách Places & Venues của Firestore
 * @param {Array} places Danh sách địa điểm đã xuất bản
 * @param {Array} venues Danh sách quán ăn/nước đã xuất bản
 * @param {string} lang Ngôn ngữ ('vi' | 'en')
 * @param {string|null} activePlaceId ID địa điểm đang được quan tâm trong ngữ cảnh
 */
export function buildTourismContextPrompt(places = [], venues = [], lang = "vi", activePlaceId = null) {
  const placeSummaries = places.map((p) => {
    const name = p.name?.[lang] || p.name?.vi || p.name?.en || p.id;
    const addr = p.address?.[lang] || p.address?.vi || p.address?.en || "Đang cập nhật";
    const hours = p.openingHours?.[lang] || p.openingHours?.vi || p.openingHours?.en || "Đang cập nhật";
    const price = p.ticketPrice?.[lang] || p.ticketPrice?.vi || p.ticketPrice?.en || "Miễn phí / Chưa rõ";
    const summary = p.summary?.[lang] || p.summary?.vi || p.summary?.en || "";
    const historyExcerpt = (p.history?.[lang] || p.history?.vi || p.history?.en || "").slice(0, 320);

    return `[PLACE: ${p.id}]
- Tên: ${name}
- Quận: ${p.district || "Quận 1"}
- Danh mục: ${p.category || "Di tích"}
- Địa chỉ: ${addr}
- Giờ mở cửa: ${hours}
- Giá vé: ${price}
- Giới thiệu ngắn: ${summary}
- Lịch sử chính: ${historyExcerpt}
- Có Audio Guide: ${Boolean(p.audioGuide?.vi?.url || p.audioGuide?.url)}
- Có QR Code: ${Boolean(p.qrGuide?.vi?.imageUrl || p.qrGuide?.imageUrl)}`;
  }).join("\n\n");

  const venueSummaries = venues.map((v) => {
    const vName = v.name?.[lang] || v.name?.vi || v.name?.en || v.id;
    const vAddr = v.address?.[lang] || v.address?.vi || v.address?.en || "";
    const vType = v.type === "drink" ? "Quán nước / Cà phê" : "Quán ăn ẩm thực";
    const vDesc = v.description?.[lang] || v.description?.vi || v.description?.en || "";
    const linked = Array.isArray(v.placeIds) ? v.placeIds.join(", ") : "";

    return `[VENUE: ${v.id}] ${vName} (${vType}) - Địa chỉ: ${vAddr}. Món: ${v.category || ""}. Mô tả: ${vDesc}. Liên kết với địa điểm: [${linked}]`;
  }).join("\n");

  return `
[TOURISM_DATABASE_CONTEXT]
Dưới đây là cơ sở dữ liệu du lịch chính thức của Thành phố Hồ Chí Minh trên website:

=== DANH SÁCH ĐỊA ĐIỂM DU LỊCH ĐÃ XÁC MINH ===
${placeSummaries}

=== DANH SÁCH QUÁN ĂN VÀ QUÁN NƯỚC LIÊN KẾT ===
${venueSummaries}

=== THÔNG TIN NGỮ CẢNH HIỆN TẠI ===
- Ngôn ngữ ưu tiên: ${lang === "vi" ? "Tiếng Việt" : "English"}
- Địa điểm đang tham chiếu: ${activePlaceId ? `[PLACE: ${activePlaceId}]` : "Chưa có địa điểm cụ thể"}
`;
}

/**
 * Rút gọn lịch sử trò chuyện (tối đa 8 lượt gần nhất) để giữ độ trễ thấp và tiết kiệm token
 */
export function formatConversationHistory(messages = [], maxTurns = 8) {
  const recent = messages.slice(-maxTurns);
  const formatted = [];

  for (const m of recent) {
    if (m.sender === "user") {
      formatted.push({
        role: "user",
        parts: [{ text: m.text }]
      });
    } else if (m.sender === "bot") {
      formatted.push({
        role: "model",
        parts: [{ text: m.text }]
      });
    }
  }

  return formatted;
}
