import { getPublishedPlaces, getPlaceById } from "./placeService";
import { getPublishedVenues, getVenuesByPlaceId } from "./venueService";
import { analyzeUserIntent } from "../chatbot/chatbotIntents";
import { 
  createWelcomeMessage, 
  createPlaceIntroMessage, 
  createHistoryMessage 
} from "../chatbot/chatbotFlows";
import { 
  getDirectionsUrl, 
  getTransitUrl, 
  getNearbyBusStopsUrl, 
  getVenueDirectionsUrl 
} from "../utils/googleMapsLinks";

/**
 * Xử lý tin nhắn người dùng và trả về danh sách tin nhắn phản hồi
 * @param {string} userInput Tin nhắn người dùng nhập (nếu có)
 * @param {object} actionPayload Dữ liệu từ nút bấm (action, flow, placeId, category...)
 * @param {object} context Ngữ cảnh hội thoại hiện tại
 * @param {string} lang Ngôn ngữ ('vi' | 'en')
 */
export async function processChatbotTurn(userInput, actionPayload, context, lang = "vi") {
  const places = await getPublishedPlaces();
  const venues = await getPublishedVenues();

  // 1. Nếu người dùng bấm nút hành động (Button Click)
  if (actionPayload) {
    return handleButtonClick(actionPayload, context, places, venues, lang);
  }

  // 2. Nếu người dùng nhập tin nhắn tự do (Free Text Input)
  if (userInput && userInput.trim()) {
    return handleFreeTextInput(userInput.trim(), context, places, venues, lang);
  }

  // Mặc định trả về lời chào
  return {
    responseMessages: [createWelcomeMessage(lang)],
    updatedContext: { flow: "MAIN_MENU", selectedPlace: null }
  };
}

/**
 * Xử lý các sự kiện bấm nút nhanh
 */
async function handleButtonClick(payload, context, places, venues, lang) {
  const { flow, action, placeId, category, venueId } = payload;

  // Chuyển về Menu chính
  if (flow === "MAIN_MENU" || action === "RESET_CHAT") {
    return {
      responseMessages: [createWelcomeMessage(lang)],
      updatedContext: { flow: "MAIN_MENU", selectedPlace: null, referencePlace: null }
    };
  }

  // Luồng 1: Tìm hiểu địa điểm
  if (flow === "LEARN_PLACE" || action === "CHOOSE_PLACE_MENU") {
    // Nếu người dùng đang xem một địa điểm trên web và chưa chọn địa điểm khác
    if (context.currentWebPlace && !placeId) {
      const place = context.currentWebPlace;
      const name = place.name?.[lang] || place.name?.vi || place.name?.en;
      return {
        responseMessages: [
          {
            id: `msg-${Date.now()}`,
            sender: "bot",
            text:
              lang === "vi"
                ? `Bạn đang xem trang **${name}**. Bạn có muốn tìm hiểu chi tiết về địa điểm này không?`
                : `You are viewing **${name}**. Would you like to explore this place?`,
            options: [
              { id: "btn-confirm-cur", label: lang === "vi" ? `✅ Đúng, tìm hiểu ${name}` : `✅ Yes, tell me about ${name}`, action: "SELECT_PLACE", placeId: place.id },
              { id: "btn-pick-other", label: lang === "vi" ? "🔍 Chọn địa danh khác" : "🔍 Pick another place", action: "LIST_ALL_PLACES" },
              { id: "btn-back", label: lang === "vi" ? "⬅️ Quay lại" : "⬅️ Back", flow: "MAIN_MENU" }
            ]
          }
        ],
        updatedContext: { ...context, flow: "CONFIRM_CURRENT_PLACE" }
      };
    }

    return renderPlaceSelectionMenu(places, lang, context);
  }

  if (action === "LIST_ALL_PLACES") {
    return renderPlaceSelectionMenu(places, lang, context);
  }

  // Chọn một địa điểm cụ thể
  if (action === "SELECT_PLACE" && placeId) {
    const place = places.find((p) => p.id === placeId) || (await getPlaceById(placeId));
    if (!place) {
      return {
        responseMessages: [
          {
            id: `msg-${Date.now()}`,
            sender: "bot",
            text: lang === "vi" ? "Không tìm thấy địa điểm này trong dữ liệu." : "Place not found in records.",
            options: [{ id: "btn-back", label: lang === "vi" ? "Menu chính" : "Main menu", flow: "MAIN_MENU" }]
          }
        ],
        updatedContext: { ...context, flow: "MAIN_MENU" }
      };
    }

    return {
      responseMessages: [createPlaceIntroMessage(place, lang)],
      updatedContext: { ...context, flow: "PLACE_SELECTED", selectedPlace: place, referencePlace: place }
    };
  }

  // Lịch sử
  if (action === "SHOW_HISTORY" && placeId) {
    const place = places.find((p) => p.id === placeId) || context.selectedPlace;
    if (place) {
      return {
        responseMessages: [createHistoryMessage(place, lang)],
        updatedContext: { ...context, selectedPlace: place }
      };
    }
  }

  // Nghe thuyết minh Audio Guide trực tiếp trong chat
  if (action === "PLAY_AUDIO" && placeId) {
    const place = places.find((p) => p.id === placeId) || (await getPlaceById(placeId)) || context.selectedPlace;
    if (place) {
      const placeName = place.name?.[lang] || place.name?.vi || place.name?.en;
      const audioGuideData = place.audioGuide || {
        vi: { title: `Thuyết minh ${placeName}`, url: "/assets/audio/Attention.mp3", duration: "3:45" },
        en: { title: `${placeName} Audio Guide`, url: "/assets/audio/Attention.mp3", duration: "3:45" }
      };

      const introText = lang === "vi"
        ? `🎧 **Thuyết minh Audio Guide - ${placeName}**\n\nBạn có thể bấm nút Play để nghe thuyết minh trực tiếp ngay trong khung chat và chuyển đổi ngôn ngữ Việt / Anh:`
        : `🎧 **Audio Guide - ${placeName}**\n\nYou can press Play to listen to the audio tour directly in this chat, or switch between Vietnamese and English:`;

      return {
        responseMessages: [
          {
            id: `msg-${Date.now()}`,
            sender: "bot",
            text: introText,
            audioData: audioGuideData,
            placeName: placeName,
            options: [
              { id: "btn-back-place", label: lang === "vi" ? "⬅️ Về giới thiệu địa điểm" : "⬅️ Back to place overview", action: "SELECT_PLACE", placeId: place.id },
              { id: "btn-detail", label: lang === "vi" ? "📖 Xem đầy đủ chi tiết" : "📖 View full details", action: "NAVIGATE_DETAIL", placeId: place.id },
              { id: "btn-map", label: lang === "vi" ? "🗺️ Xem trên bản đồ" : "🗺️ Show on map", action: "SHOW_ON_MAP", placeId: place.id },
              { id: "btn-home", label: lang === "vi" ? "🏠 Menu chính" : "🏠 Main menu", flow: "MAIN_MENU" }
            ]
          }
        ],
        updatedContext: { ...context, selectedPlace: place }
      };
    }
  }

  // Luồng 2: Tìm quán ăn / quán nước
  if (flow === "FIND_FOOD" || action === "FOOD_MENU") {
    // Bước 1: Chọn địa điểm tham chiếu
    const options = places.slice(0, 8).map((p) => ({
      id: `food-ref-${p.id}`,
      label: p.name?.[lang] || p.name?.vi || p.name?.en,
      action: "CHOOSE_FOOD_CATEGORY",
      placeId: p.id
    }));

    options.push({ id: "btn-menu", label: lang === "vi" ? "🏠 Menu chính" : "🏠 Main menu", flow: "MAIN_MENU" });

    return {
      responseMessages: [
        {
          id: `msg-${Date.now()}`,
          sender: "bot",
          text:
            lang === "vi"
              ? "Bạn muốn tìm đồ ăn hoặc quán cà phê gần địa điểm tham quan nào dưới đây?"
              : "Which tourist attraction would you like to find food or drinks near?",
          options
        }
      ],
      updatedContext: { ...context, flow: "PICK_FOOD_REFERENCE" }
    };
  }

  // Sau khi chọn địa điểm tham chiếu để tìm đồ ăn
  if (action === "CHOOSE_FOOD_CATEGORY" && placeId) {
    const place = places.find((p) => p.id === placeId);
    const placeName = place?.name?.[lang] || place?.name?.vi || place?.name?.en;

    return {
      responseMessages: [
        {
          id: `msg-${Date.now()}`,
          sender: "bot",
          text:
            lang === "vi"
              ? `Bạn muốn tìm gì gần **${placeName}**?`
              : `What are you craving near **${placeName}**?`,
          options: [
            { id: "opt-cat-restaurant", label: lang === "vi" ? "🍲 Quán ăn" : "🍲 Restaurants", action: "SHOW_FOOD_LIST", placeId, category: "restaurant" },
            { id: "opt-cat-drink", label: lang === "vi" ? "☕ Quán nước / Cà phê" : "☕ Cafes & Drinks", action: "SHOW_FOOD_LIST", placeId, category: "drink" },
            { id: "opt-cat-both", label: lang === "vi" ? "🍽️ Xem cả hai" : "🍽️ Both", action: "SHOW_FOOD_LIST", placeId, category: "both" },
            { id: "btn-back", label: lang === "vi" ? "⬅️ Chọn địa điểm khác" : "⬅️ Change location", flow: "FIND_FOOD" }
          ]
        }
      ],
      updatedContext: { ...context, flow: "PICK_CATEGORY", referencePlace: place }
    };
  }

  // Hiển thị danh sách quán ăn
  if ((action === "SHOW_FOOD_LIST" || action === "FOOD_NEAR_PLACE") && placeId) {
    const place = places.find((p) => p.id === placeId) || context.referencePlace;
    const cat = category || "both";
    const placeName = place?.name?.[lang] || place?.name?.vi || place?.name?.en;

    const matchedVenues = venues.filter((v) => {
      const isLinked = Array.isArray(v.placeIds) && v.placeIds.includes(placeId);
      if (!isLinked) return false;
      if (cat === "both") return true;
      return v.type === cat;
    });

    if (matchedVenues.length === 0) {
      return {
        responseMessages: [
          {
            id: `msg-${Date.now()}`,
            sender: "bot",
            text:
              lang === "vi"
                ? `Hiện danh sách gợi ý quán quanh **${placeName}** đang được bổ sung và xác minh. Bạn có thể chọn địa điểm tham quan khác nhé!`
                : `Culinary recommendations around **${placeName}** are currently being verified. Please pick another location!`,
            options: [
              { id: "btn-other-area", label: lang === "vi" ? "🔄 Chọn khu vực khác" : "🔄 Pick another area", flow: "FIND_FOOD" },
              { id: "btn-menu", label: lang === "vi" ? "🏠 Menu chính" : "🏠 Main menu", flow: "MAIN_MENU" }
            ]
          }
        ],
        updatedContext: { ...context, referencePlace: place }
      };
    }

    // Tạo tin nhắn kèm danh sách quán
    let venuesText =
      lang === "vi"
        ? `Gợi ý quán ăn & nước gần **${placeName}**:\n\n`
        : `Recommended spots near **${placeName}**:\n\n`;

    matchedVenues.slice(0, 4).forEach((v, index) => {
      const vName = v.name?.[lang] || v.name?.vi || v.name?.en;
      const vAddr = v.address?.[lang] || v.address?.vi || v.address?.en;
      const vDesc = v.description?.[lang] || v.description?.vi || v.description?.en;
      const typeTag = v.type === "restaurant" ? (lang === "vi" ? "🍲 Quán ăn" : "🍲 Food") : (lang === "vi" ? "☕ Quán nước" : "☕ Cafe");

      venuesText += `${index + 1}. **${vName}** (${typeTag})\n📍 *${vAddr}*\n📝 ${vDesc}\n\n`;
    });

    // Tạo nút Google Maps cho quán đầu tiên & tùy chọn thêm
    const options = matchedVenues.slice(0, 3).map((v) => ({
      id: `btn-gmap-${v.id}`,
      label: `🗺️ ${v.name?.[lang] || v.name?.vi} (Maps)`,
      action: "EXTERNAL_LINK",
      url: v.googleMapsUrl || getDirectionsUrl(v.address?.vi || v.name?.vi, placeName)
    }));

    options.push(
      { id: "btn-other-place", label: lang === "vi" ? "🔄 Tìm khu vực khác" : "🔄 Find another area", flow: "FIND_FOOD" },
      { id: "btn-menu", label: lang === "vi" ? "🏠 Menu chính" : "🏠 Main menu", flow: "MAIN_MENU" }
    );

    return {
      responseMessages: [
        {
          id: `msg-${Date.now()}`,
          sender: "bot",
          text: venuesText.trim(),
          options
        }
      ],
      updatedContext: { ...context, referencePlace: place }
    };
  }

  // Luồng 3: Chỉ đường và xe buýt
  if (flow === "DIRECTIONS" || action === "LIST_DESTINATIONS") {
    const options = places.map((p) => ({
      id: `dest-${p.id}`,
      label: `📍 ${p.name?.[lang] || p.name?.vi}`,
      action: "CHOOSE_TRANSIT_DESTINATION",
      placeId: p.id
    }));
    options.push({ id: "btn-menu", label: lang === "vi" ? "🏠 Menu chính" : "🏠 Main menu", flow: "MAIN_MENU" });

    return {
      responseMessages: [
        {
          id: `msg-${Date.now()}`,
          sender: "bot",
          text:
            lang === "vi"
              ? "Bạn muốn tìm đường hoặc tra cứu phương tiện di chuyển đến địa điểm nào dưới đây?"
              : "Which destination would you like directions or public transit to?",
          options
        }
      ],
      updatedContext: { ...context, flow: "PICK_TRANSIT_DESTINATION" }
    };
  }

  // Khi người dùng chọn một địa điểm cụ thể để tìm đường / xe buýt
  if ((action === "CHOOSE_TRANSIT_DESTINATION" || action === "TRANSIT_MENU") && placeId) {
    const targetPlace = places.find((p) => p.id === placeId) || (await getPlaceById(placeId)) || places[0];
    const placeName = targetPlace?.name?.[lang] || targetPlace?.name?.vi;
    const addr = targetPlace?.address?.vi || targetPlace?.address?.en || placeName;

    return {
      responseMessages: [
        {
          id: `msg-${Date.now()}`,
          sender: "bot",
          text:
            lang === "vi"
              ? `Chỉ đường và phương tiện công cộng đến **${placeName}**:\n📍 *${addr}*\n\nBạn hãy chọn thao tác mở lộ trình trên Google Maps:`
              : `Directions & public transit to **${placeName}**:\n📍 *${addr}*\n\nSelect an option below to open Google Maps:`,
          options: [
            {
              id: "btn-open-dir",
              label: lang === "vi" ? `🧭 Chỉ đường đến ${placeName}` : `🧭 Directions to ${placeName}`,
              action: "EXTERNAL_LINK",
              url: getDirectionsUrl(addr)
            },
            {
              id: "btn-open-bus",
              label: lang === "vi" ? `🚌 Tuyến xe buýt đến ${placeName}` : `🚌 Bus route to ${placeName}`,
              action: "EXTERNAL_LINK",
              url: getTransitUrl(addr)
            },
            {
              id: "btn-open-bus-stop",
              label: lang === "vi" ? `🚏 Trạm xe buýt gần ${placeName}` : `🚏 Nearby bus stops`,
              action: "EXTERNAL_LINK",
              url: getNearbyBusStopsUrl(placeName)
            },
            { id: "btn-pick-other-dest", label: lang === "vi" ? "🔄 Chọn điểm đến khác" : "🔄 Pick another destination", flow: "DIRECTIONS" },
            { id: "btn-menu", label: lang === "vi" ? "🏠 Menu chính" : "🏠 Main menu", flow: "MAIN_MENU" }
          ]
        }
      ],
      updatedContext: { ...context, flow: "DIRECTIONS_CHOICE", selectedPlace: targetPlace }
    };
  }

  // Mặc định
  return {
    responseMessages: [createWelcomeMessage(lang)],
    updatedContext: { flow: "MAIN_MENU" }
  };
}

/**
 * Hiển thị danh sách địa điểm để người dùng chọn
 */
function renderPlaceSelectionMenu(places, lang, context) {
  const options = places.map((p) => ({
    id: `opt-place-${p.id}`,
    label: p.name?.[lang] || p.name?.vi || p.name?.en,
    action: "SELECT_PLACE",
    placeId: p.id
  }));

  options.push({ id: "btn-menu", label: lang === "vi" ? "🏠 Menu chính" : "🏠 Main menu", flow: "MAIN_MENU" });

  return {
    responseMessages: [
      {
        id: `msg-${Date.now()}`,
        sender: "bot",
        text:
          lang === "vi"
            ? "Bạn muốn khám phá địa điểm nào trong danh sách dưới đây?"
            : "Which destination would you like to explore?",
        options
      }
    ],
    updatedContext: { ...context, flow: "SELECTING_PLACE" }
  };
}

/**
 * Xử lý nhập câu hỏi tự do bằng ngôn ngữ tự nhiên
 */
async function handleFreeTextInput(text, context, places, venues, lang) {
  const intent = analyzeUserIntent(text, places, context);

  // 1. Nếu nhận diện được yêu cầu lịch sử
  if (intent.type === "ASK_HISTORY") {
    const targetPlace = intent.place || context.selectedPlace || places[0];
    return {
      responseMessages: [createHistoryMessage(targetPlace, lang)],
      updatedContext: { ...context, selectedPlace: targetPlace }
    };
  }

  // 2. Nếu tìm quán ăn
  if (intent.type === "FIND_FOOD" || intent.type === "FIND_DRINKS") {
    const targetPlace = intent.place || context.selectedPlace || context.referencePlace || places[0];
    return handleButtonClick(
      { action: "SHOW_FOOD_LIST", placeId: targetPlace.id, category: intent.category },
      context,
      places,
      venues,
      lang
    );
  }

  // 3. Nếu tìm xe buýt hoặc chỉ đường
  if (intent.type === "BUS_ROUTES" || intent.type === "GET_DIRECTIONS") {
    if (intent.place) {
      return handleButtonClick(
        { action: "CHOOSE_TRANSIT_DESTINATION", placeId: intent.place.id },
        { ...context, selectedPlace: intent.place },
        places,
        venues,
        lang
      );
    }
    return handleButtonClick(
      { flow: "DIRECTIONS" },
      context,
      places,
      venues,
      lang
    );
  }

  // 4. Nếu hỏi về địa điểm
  if (intent.type === "ASK_PLACE_INFO" && intent.place) {
    return {
      responseMessages: [createPlaceIntroMessage(intent.place, lang)],
      updatedContext: { ...context, selectedPlace: intent.place, referencePlace: intent.place }
    };
  }

  // 5. Nếu muốn xem bản đồ
  if (intent.type === "SHOW_MAP") {
    const targetPlace = intent.place || context.selectedPlace;
    return {
      responseMessages: [
        {
          id: `msg-${Date.now()}`,
          sender: "bot",
          text:
            lang === "vi"
              ? `Đang mở bản đồ ${targetPlace ? `tại ${targetPlace.name?.vi}` : "thành phố"} cho bạn...`
              : `Opening map view for you...`,
          options: [
            {
              id: "btn-act-map",
              label: lang === "vi" ? "🗺️ Đi đến bản đồ ngay" : "🗺️ View on map now",
              action: "SHOW_ON_MAP",
              placeId: targetPlace?.id
            }
          ]
        }
      ],
      updatedContext: { ...context, selectedPlace: targetPlace }
    };
  }

  // 6. Nếu muốn nghe Audio
  if (intent.type === "AUDIO_GUIDE") {
    const targetPlace = intent.place || context.selectedPlace || places[0];
    return {
      responseMessages: [
        {
          id: `msg-${Date.now()}`,
          sender: "bot",
          text:
            lang === "vi"
              ? `🎧 Thuyết minh về **${targetPlace.name?.vi}** đã sẵn sàng. Bạn có thể nghe ngay trong trang chi tiết!`
              : `🎧 Audio guide for **${targetPlace.name?.en}** is available!`,
          options: [
            { id: "btn-audio-open", label: lang === "vi" ? "🎧 Mở trang nghe thuyết minh" : "🎧 Open audio player", action: "PLAY_AUDIO", placeId: targetPlace.id },
            { id: "btn-menu", label: lang === "vi" ? "🏠 Menu chính" : "🏠 Main menu", flow: "MAIN_MENU" }
          ]
        }
      ],
      updatedContext: { ...context, selectedPlace: targetPlace }
    };
  }

  // 7. Nếu câu hỏi không rõ ràng -> Trả lời thân thiện và gợi ý
  return {
    responseMessages: [
      {
        id: `msg-${Date.now()}`,
        sender: "bot",
        text:
          lang === "vi"
            ? `Cảm ơn bạn đã hỏi! Hiện tại mình đang hoạt động theo hướng dẫn viên kịch bản. Bạn có thể chọn một trong các mục bên dưới hoặc hỏi theo cú pháp: "Quán ăn gần Dinh Độc Lập", "Lịch sử Nhà thờ Đức Bà", hay "Chỉ đường đến Chợ Bến Thành" nhé!`
            : `Thanks for asking! I'm currently running in scripted tour guide mode. You can pick an option below or try asking: "Food near Independence Palace", "History of Notre Dame", or "Directions to Ben Thanh Market"!`,
        options: [
          { id: "opt-1", label: lang === "vi" ? "📍 Tìm hiểu địa điểm" : "📍 Explore a place", flow: "LEARN_PLACE" },
          { id: "opt-2", label: lang === "vi" ? "🍜 Gợi ý quán ăn" : "🍜 Find food", flow: "FIND_FOOD" },
          { id: "opt-3", label: lang === "vi" ? "🚌 Chỉ đường xe buýt" : "🚌 Bus & Transit", flow: "DIRECTIONS" },
          { id: "opt-4", label: lang === "vi" ? "🗺️ Xem bản đồ" : "🗺️ View Map", action: "OPEN_MAP" }
        ]
      }
    ],
    updatedContext: { ...context }
  };
}
