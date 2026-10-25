import { getDirectionsUrl, getTransitUrl, getNearbyBusStopsUrl, getSearchUrl } from "../utils/googleMapsLinks";

/**
 * Trình sinh câu thoại và danh sách nút lựa chọn cho Chatbot
 */

export function createWelcomeMessage(lang = "vi") {
  return {
    id: `msg-${Date.now()}`,
    sender: "bot",
    text:
      lang === "vi"
        ? "Xin chào! Mình là Plunis - hướng dẫn viên du lịch của bạn tại Thành phố Hồ Chí Minh. Hôm nay bạn muốn khám phá điều gì?"
        : "Hello! I am Plunis - your tour guide for Ho Chi Minh City. What would you like to explore today?",
    options: [
      { id: "opt-places", label: lang === "vi" ? "📍 Tìm hiểu về một địa điểm" : "📍 Learn about a place", flow: "LEARN_PLACE" },
      { id: "opt-food", label: lang === "vi" ? "🍜 Tìm quán ăn hoặc quán nước" : "🍜 Find food and drinks", flow: "FIND_FOOD" },
      { id: "opt-transit", label: lang === "vi" ? "🚌 Tìm đường & phương tiện" : "🚌 Directions & transport", flow: "DIRECTIONS" },
      { id: "opt-map", label: lang === "vi" ? "🗺️ Xem bản đồ du lịch" : "🗺️ View tourist map", action: "OPEN_MAP" }
    ]
  };
}

export function createPlaceIntroMessage(place, lang = "vi") {
  const name = place.name?.[lang] || place.name?.vi || place.name?.en;
  const summary = place.summary?.[lang] || place.summary?.vi || place.summary?.en;
  const address = place.address?.[lang] || place.address?.vi || place.address?.en;

  const textVi = `🏛️ **${name}**\n\n${summary}\n\n📍 *Địa chỉ:* ${address}`;
  const textEn = `🏛️ **${name}**\n\n${summary}\n\n📍 *Address:* ${address}`;

  const options = [
    { id: "btn-map", label: lang === "vi" ? "🗺️ Xem trên bản đồ" : "🗺️ Show on map", action: "SHOW_ON_MAP", placeId: place.id },
    { id: "btn-detail", label: lang === "vi" ? "📖 Xem đầy đủ chi tiết" : "📖 View full details", action: "NAVIGATE_DETAIL", placeId: place.id },
    { id: "btn-audio", label: lang === "vi" ? "🎧 Nghe thuyết minh" : "🎧 Listen to audio guide", action: "PLAY_AUDIO", placeId: place.id },
    { id: "btn-history", label: lang === "vi" ? "📜 Lịch sử di tích" : "📜 Monument history", action: "SHOW_HISTORY", placeId: place.id },
    { id: "btn-food-near", label: lang === "vi" ? "🍲 Quán ăn & cà phê gần đây" : "🍲 Food & cafe nearby", action: "FOOD_NEAR_PLACE", placeId: place.id },
    { id: "btn-choose-other", label: lang === "vi" ? "🔄 Chọn địa điểm khác" : "🔄 Choose another place", flow: "LEARN_PLACE" },
    { id: "btn-home", label: lang === "vi" ? "🏠 Menu chính" : "🏠 Main menu", flow: "MAIN_MENU" }
  ];

  return {
    id: `msg-${Date.now()}`,
    sender: "bot",
    text: lang === "vi" ? textVi : textEn,
    options,
    place
  };
}

export function createHistoryMessage(place, lang = "vi") {
  const name = place.name?.[lang] || place.name?.vi || place.name?.en;
  const historyText = place.history?.[lang] || place.history?.vi || place.history?.en;

  const content = historyText 
    ? (lang === "vi" 
        ? `📜 **Lịch sử hình thành ${name}:**\n\n${historyText}` 
        : `📜 **History of ${name}:**\n\n${historyText}`)
    : (lang === "vi" 
        ? `Dữ liệu lịch sử chi tiết cho ${name} đang được bổ sung và xác minh.` 
        : `Detailed historical records for ${name} are currently being updated.`);

  return {
    id: `msg-${Date.now()}`,
    sender: "bot",
    text: content,
    options: [
      { id: "btn-detail-history", label: lang === "vi" ? "📖 Xem tab Lịch sử chi tiết" : "📖 Full History Tab", action: "NAVIGATE_DETAIL", placeId: place.id, tab: "history" },
      { id: "btn-audio", label: lang === "vi" ? "🎧 Nghe thuyết minh" : "🎧 Listen to audio", action: "PLAY_AUDIO", placeId: place.id },
      { id: "btn-food", label: lang === "vi" ? "🍲 Quán ăn & cà phê gần đây" : "🍲 Food & cafes nearby", action: "FOOD_NEAR_PLACE", placeId: place.id },
      { id: "btn-map", label: lang === "vi" ? "🗺️ Xem trên bản đồ" : "🗺️ Show on map", action: "SHOW_ON_MAP", placeId: place.id },
      { id: "btn-back-place", label: lang === "vi" ? "⬅️ Về giới thiệu địa điểm" : "⬅️ Back to overview", action: "SELECT_PLACE", placeId: place.id }
    ]
  };
}
