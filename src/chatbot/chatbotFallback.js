import { analyzeUserIntent } from "./chatbotIntents";
import { 
  createWelcomeMessage, 
  createPlaceIntroMessage, 
  createHistoryMessage 
} from "./chatbotFlows";

/**
 * Xử lý tin nhắn và phân luồng từ khóa có sẵn với dữ liệu trực tiếp từ Firestore / Admin
 */
export async function processFallbackChatTurn(userInput, actionPayload, context = {}, places = [], venues = [], lang = "vi") {
  const currentPlace = context.selectedPlace || context.referencePlace || null;

  // 1. Nếu người dùng chọn nút hành động (actionPayload)
  if (actionPayload) {
    if (actionPayload.action === "RESET_CHAT" || actionPayload.flow === "MAIN_MENU") {
      return {
        responseMessages: [createWelcomeMessage(lang)],
        updatedContext: { ...context, flow: "MAIN_MENU", selectedPlace: null, referencePlace: null }
      };
    }

    if ((actionPayload.action === "SELECT_PLACE" || actionPayload.action === "INTRO_PLACE") && actionPayload.placeId) {
      const place = places.find((p) => p.id === actionPayload.placeId);
      if (place) {
        return {
          responseMessages: [createPlaceIntroMessage(place, lang)],
          updatedContext: { ...context, selectedPlace: place, referencePlace: place }
        };
      }
    }
  }

  // 2. Nếu người dùng nhập câu hỏi tự do hoặc gửi qua click nút
  if (userInput && userInput.trim()) {
    const intent = analyzeUserIntent(userInput.trim(), places, context);
    const targetPlace = intent.place || currentPlace;

    // A. Chào hỏi xã giao
    if (intent.type === "GREETING") {
      return {
        responseMessages: [
          {
            id: `msg-${Date.now()}`,
            sender: "bot",
            text:
              lang === "vi"
                ? "Dạ chào bạn! Mình là Plunis - Trợ lý hướng dẫn viên du lịch Sài Gòn. Rất vui được đồng hành cùng bạn hôm nay! Bạn muốn tìm hiểu địa điểm nào hay tìm quán ăn ngon nè?"
                : "Hello there! I'm Plunis, your Saigon tour guide assistant. Great to have you here! Which historic sight or local food would you like to explore today?",
            options: [
              { id: "opt-1", label: lang === "vi" ? "🏛️ Khám phá địa điểm" : "🏛️ Explore Landmarks", action: "LIST_ALL_PLACES" },
              { id: "opt-2", label: lang === "vi" ? "🍜 Gợi ý quán ăn" : "🍜 Food Suggestions", action: "LIST_PLACES_FOR_FOOD" },
              { id: "opt-3", label: lang === "vi" ? "🎧 Nghe thuyết minh" : "🎧 Audio Guides", action: "LIST_PLACES_FOR_AUDIO" }
            ],
            isFallback: true
          }
        ],
        updatedContext: context
      };
    }

    // B. Cảm ơn
    if (intent.type === "THANKS") {
      return {
        responseMessages: [
          {
            id: `msg-${Date.now()}`,
            sender: "bot",
            text:
              lang === "vi"
                ? "Dạ không có chi nè! Rất vui được hỗ trợ bạn. Chúc bạn có một hành trình khám phá Sài Gòn thật nhiều niềm vui và trải nghiệm tuyệt vời nhé! ✨"
                : "My absolute pleasure! Wishing you a wonderful time and lots of memorable moments in Saigon! ✨",
            isFallback: true
          }
        ],
        updatedContext: context
      };
    }

    // C. Đặt lại Menu
    if (intent.type === "RESET_MENU") {
      return {
        responseMessages: [createWelcomeMessage(lang)],
        updatedContext: { ...context, flow: "MAIN_MENU", selectedPlace: null, referencePlace: null }
      };
    }

    // D. Danh sách địa điểm khi người dùng hỏi chung KHÔNG chỉ định địa điểm cụ thể:

    // D1: Hỏi chung về Audio / Thuyết minh
    if (intent.type === "LIST_PLACES_FOR_AUDIO" || (!targetPlace && intent.type === "ASK_AUDIO")) {
      return {
        responseMessages: [
          {
            id: `msg-list-audio-${Date.now()}`,
            sender: "bot",
            text:
              lang === "vi"
                ? "Dạ, bạn muốn nghe bài thuyết minh âm thanh (Audio Guide) của địa danh nào? Hãy chọn một trong các địa điểm nổi bật dưới đây để nghe ngay nhé:"
                : "Which attraction's audio guide would you like to listen to? Pick a landmark below to play narration directly:",
            options: places.map((p) => ({
              id: `btn-audio-${p.id}`,
              label: `🎧 ${p.name?.[lang] || p.name?.vi || p.id}`,
              action: "PLAY_AUDIO",
              placeId: p.id
            })),
            isFallback: true
          }
        ],
        updatedContext: context
      };
    }

    // D2: Hỏi chung về Quán ăn
    if (intent.type === "LIST_PLACES_FOR_FOOD" || (!targetPlace && intent.type === "FIND_FOOD")) {
      return {
        responseMessages: [
          {
            id: `msg-list-food-${Date.now()}`,
            sender: "bot",
            text:
              lang === "vi"
                ? "Bạn muốn tìm quán ăn ngon lân cận khu vực nào? Vui lòng chọn một địa danh bên dưới để xem danh sách quán ăn được tuyển chọn:"
                : "Near which landmark are you looking for food? Select an attraction below to see top curated food spots:",
            options: places.map((p) => ({
              id: `btn-food-${p.id}`,
              label: `🍜 ${p.name?.[lang] || p.name?.vi || p.id}`,
              action: "FOOD_MENU",
              placeId: p.id
            })),
            isFallback: true
          }
        ],
        updatedContext: context
      };
    }

    // D3: Hỏi chung về Cà phê / Quán nước
    if (intent.type === "LIST_PLACES_FOR_DRINK" || (!targetPlace && intent.type === "FIND_DRINKS")) {
      return {
        responseMessages: [
          {
            id: `msg-list-drink-${Date.now()}`,
            sender: "bot",
            text:
              lang === "vi"
                ? "Bạn muốn tìm quán cà phê hoặc đồ uống view đẹp gần đâu? Chọn một địa điểm dưới đây nhé:"
                : "Near which sight would you like to find a nice cafe or drink? Pick an attraction below:",
            options: places.map((p) => ({
              id: `btn-drink-${p.id}`,
              label: `☕ ${p.name?.[lang] || p.name?.vi || p.id}`,
              action: "DRINK_MENU",
              placeId: p.id
            })),
            isFallback: true
          }
        ],
        updatedContext: context
      };
    }

    // D4: Hỏi chung về Địa chỉ
    if (intent.type === "LIST_PLACES_FOR_ADDRESS" || (!targetPlace && intent.type === "ASK_ADDRESS")) {
      return {
        responseMessages: [
          {
            id: `msg-list-addr-${Date.now()}`,
            sender: "bot",
            text:
              lang === "vi"
                ? "Bạn muốn tra cứu địa chỉ của địa danh nào? Chọn địa điểm bên dưới để xem địa chỉ cụ thể và chỉ đường:"
                : "Which landmark's address are you looking for? Pick one below to check address and directions:",
            options: places.map((p) => ({
              id: `btn-addr-${p.id}`,
              label: `📍 ${p.name?.[lang] || p.name?.vi || p.id}`,
              action: "SHOW_ADDRESS",
              placeId: p.id
            })),
            isFallback: true
          }
        ],
        updatedContext: context
      };
    }

    // D5: Hỏi chung về Danh sách địa điểm / Thông tin khám phá
    if (intent.type === "LIST_ALL_PLACES") {
      return {
        responseMessages: [
          {
            id: `msg-list-all-${Date.now()}`,
            sender: "bot",
            text:
              lang === "vi"
                ? `Hiện tại hệ thống đang có đầy đủ ${places.length || 12} địa điểm du lịch & di tích lịch sử nổi tiếng tại TP.HCM. Bạn muốn tìm hiểu địa danh nào?`
                : `We currently have ${places.length || 12} iconic tourist landmarks & heritage monuments in Saigon. Which one would you like to explore?`,
            options: places.map((p) => ({
              id: `btn-place-${p.id}`,
              label: `🏛️ ${p.name?.[lang] || p.name?.vi || p.id}`,
              action: "SELECT_PLACE",
              placeId: p.id
            })),
            isFallback: true
          }
        ],
        updatedContext: context
      };
    }

    // E. Xử lý khi ĐÃ XÁC ĐỊNH ĐƯỢC ĐỊA ĐIỂM CỤ THỂ (targetPlace)
    if (targetPlace) {
      const placeName = targetPlace.name?.[lang] || targetPlace.name?.vi || targetPlace.name?.en || targetPlace.id;

      // E1: Ý định: Tra cứu Địa chỉ (Address)
      if (intent.type === "ASK_ADDRESS") {
        const address = targetPlace.address?.[lang] || targetPlace.address?.vi || targetPlace.address?.en || "Đang cập nhật";
        return {
          responseMessages: [
            {
              id: `msg-addr-${Date.now()}`,
              sender: "bot",
              text:
                lang === "vi"
                  ? `📍 **Địa chỉ của ${placeName}:**\n**${address}**\n\nBạn có thể bấm các nút bên dưới để mở bản đồ dẫn đường, tìm quán ăn lân cận hoặc nghe thuyết minh audio:`
                  : `📍 **Address of ${placeName}:**\n**${address}**\n\nYou can click below to open map directions, find nearby food, or listen to the audio tour:`,
              actionData: {
                type: "SHOW_PLACE",
                placeId: targetPlace.id
              },
              options: [
                { id: "opt-map", label: lang === "vi" ? "🗺️ Xem trên bản đồ" : "🗺️ Show on Map", action: "SHOW_ON_MAP", placeId: targetPlace.id },
                { id: "opt-audio", label: lang === "vi" ? "🎧 Nghe thuyết minh" : "🎧 Listen to Audio", action: "PLAY_AUDIO", placeId: targetPlace.id },
                { id: "opt-food", label: lang === "vi" ? "🍜 Quán ăn gần đây" : "🍜 Food nearby", action: "FOOD_MENU", placeId: targetPlace.id },
                { id: "opt-det", label: lang === "vi" ? "📖 Xem đầy đủ chi tiết" : "📖 Full Details", action: "NAVIGATE_DETAIL", placeId: targetPlace.id }
              ],
              isFallback: true
            }
          ],
          updatedContext: { ...context, selectedPlace: targetPlace, referencePlace: targetPlace }
        };
      }

      // E2: Ý định: Nghe thuyết minh Audio Guide
      if (intent.type === "ASK_AUDIO" || intent.type === "AUDIO_GUIDE") {
        const audioData = targetPlace.audioGuide || targetPlace.audioUrl;
        return {
          responseMessages: [
            {
              id: `msg-audio-${Date.now()}`,
              sender: "bot",
              text: audioData
                ? (lang === "vi"
                    ? `Dưới đây là bài thuyết minh âm thanh chính thức cho **${placeName}**. Bạn có thể bấm phát và nghe trực tiếp ngay tại đây:`
                    : `Here is the official audio narration for **${placeName}**. Play and listen directly below:`)
                : (lang === "vi"
                    ? `Địa danh **${placeName}** hiện đang cập nhật bài thuyết minh âm thanh. Bạn có thể xem lịch sử hoặc chi tiết tại các mục dưới đây:`
                    : `Audio narration for **${placeName}** is currently being updated. You can check details or history below:`),
              actionData: audioData
                ? {
                    type: "PLAY_AUDIO_GUIDE",
                    audioData,
                    placeName
                  }
                : null,
              options: [
                { id: "opt-food", label: lang === "vi" ? "🍜 Quán ăn gần đây" : "🍜 Food nearby", action: "FOOD_MENU", placeId: targetPlace.id },
                { id: "opt-map", label: lang === "vi" ? "🗺️ Xem trên bản đồ" : "🗺️ Show on Map", action: "SHOW_ON_MAP", placeId: targetPlace.id },
                { id: "opt-hist", label: lang === "vi" ? "📜 Lịch sử di tích" : "📜 Monument History", action: "SHOW_HISTORY", placeId: targetPlace.id },
                { id: "opt-det", label: lang === "vi" ? "📖 Xem đầy đủ chi tiết" : "📖 Full Details", action: "NAVIGATE_DETAIL", placeId: targetPlace.id }
              ],
              isFallback: true
            }
          ],
          updatedContext: { ...context, selectedPlace: targetPlace, referencePlace: targetPlace }
        };
      }

      // E3: Ý định: Quán ăn / Cà phê lân cận
      if (intent.type === "FIND_FOOD" || intent.type === "FIND_DRINKS" || intent.type === "ASK_FOOD" || intent.type === "ASK_DRINK") {
        const isDrink = intent.category === "drink" || intent.type === "FIND_DRINKS" || intent.type === "ASK_DRINK";
        const linked = venues.filter(
          (v) => Array.isArray(v.placeIds) && v.placeIds.includes(targetPlace.id) && (isDrink ? v.type === "drink" : (v.type === "restaurant" || !v.type))
        );

        return {
          responseMessages: [
            {
              id: `msg-food-${Date.now()}`,
              sender: "bot",
              text:
                lang === "vi"
                  ? `Dưới đây là một số ${isDrink ? "quán cà phê & nước" : "quán ăn ngon"} tiêu biểu quanh **${placeName}**:`
                  : `Here are popular ${isDrink ? "cafes & drinks" : "food spots"} around **${placeName}**:`,
              actionData: {
                type: "RECOMMEND_VENUES",
                placeId: targetPlace.id,
                placeName,
                venues: linked.length > 0 ? linked.slice(0, 4) : venues.slice(0, 4)
              },
              options: [
                { id: "opt-food-tab", label: lang === "vi" ? "🍜 Xem trang ẩm thực chi tiết" : "🍜 View in Food Tab", action: "NAVIGATE_DETAIL", placeId: targetPlace.id, tab: "food" },
                { id: "opt-audio", label: lang === "vi" ? "🎧 Nghe thuyết minh" : "🎧 Listen to Audio", action: "PLAY_AUDIO", placeId: targetPlace.id },
                { id: "opt-map", label: lang === "vi" ? "🗺️ Xem trên bản đồ" : "🗺️ Show on Map", action: "SHOW_ON_MAP", placeId: targetPlace.id },
                { id: "opt-other", label: lang === "vi" ? "🔄 Chọn địa điểm khác" : "🔄 Other place", action: "LIST_PLACES_FOR_FOOD" }
              ],
              isFallback: true
            }
          ],
          updatedContext: { ...context, selectedPlace: targetPlace, referencePlace: targetPlace }
        };
      }

      // E4: Ý định: Lịch sử di tích
      if (intent.type === "ASK_HISTORY") {
        return {
          responseMessages: [createHistoryMessage(targetPlace, lang)],
          updatedContext: { ...context, selectedPlace: targetPlace, referencePlace: targetPlace }
        };
      }

      // E5: Ý định: Giá vé & Giờ mở cửa (Practical Visit Info)
      if (intent.type === "ASK_PRACTICAL") {
        const ticket = targetPlace.ticketPrice?.[lang] || targetPlace.ticketPrice?.vi || targetPlace.ticketPrice?.en || (lang === "vi" ? "Miễn phí" : "Free");
        const hours = targetPlace.openingHours?.[lang] || targetPlace.openingHours?.vi || targetPlace.openingHours?.en || "07:30 - 17:00";
        return {
          responseMessages: [
            {
              id: `msg-prac-${Date.now()}`,
              sender: "bot",
              text:
                lang === "vi"
                  ? `🎫 **Thông tin tham quan ${placeName}:**\n- ⏰ **Giờ mở cửa:** ${hours}\n- 🎟️ **Giá vé tham quan:** ${ticket}\n- 📍 **Địa chỉ:** ${targetPlace.address?.vi || "Đang cập nhật"}`
                  : `🎫 **Visit Info for ${placeName}:**\n- ⏰ **Opening Hours:** ${hours}\n- 🎟️ **Ticket Price:** ${ticket}\n- 📍 **Address:** ${targetPlace.address?.en || "Updating"}`,
              options: [
                { id: "opt-map", label: lang === "vi" ? "🗺️ Xem trên bản đồ" : "🗺️ Show on Map", action: "SHOW_ON_MAP", placeId: targetPlace.id },
                { id: "opt-audio", label: lang === "vi" ? "🎧 Nghe thuyết minh" : "🎧 Audio Guide", action: "PLAY_AUDIO", placeId: targetPlace.id },
                { id: "opt-det", label: lang === "vi" ? "📖 Xem chi tiết" : "📖 Full Details", action: "NAVIGATE_DETAIL", placeId: targetPlace.id }
              ],
              isFallback: true
            }
          ],
          updatedContext: { ...context, selectedPlace: targetPlace, referencePlace: targetPlace }
        };
      }

      // E6: Ý định: Xem trên bản đồ
      if (intent.type === "VIEW_MAP" || intent.type === "SHOW_MAP") {
        return {
          responseMessages: [
            {
              id: `msg-map-${Date.now()}`,
              sender: "bot",
              text: lang === "vi"
                ? `Bấm nút bên dưới để chuyển đến bản đồ và xem vị trí của **${placeName}**:`
                : `Click below to view the map location for **${placeName}**:`,
              actionData: {
                type: "SHOW_PLACE",
                placeId: targetPlace.id
              },
              options: [
                { id: "opt-map-go", label: lang === "vi" ? "🗺️ Xem trên bản đồ" : "🗺️ Show on Map", action: "SHOW_ON_MAP", placeId: targetPlace.id },
                { id: "opt-food", label: lang === "vi" ? "🍜 Quán ăn quanh đây" : "🍜 Food nearby", action: "FOOD_MENU", placeId: targetPlace.id },
                { id: "opt-det-go", label: lang === "vi" ? "📖 Xem chi tiết" : "📖 Full Details", action: "NAVIGATE_DETAIL", placeId: targetPlace.id }
              ],
              isFallback: true
            }
          ],
          updatedContext: { ...context, selectedPlace: targetPlace, referencePlace: targetPlace }
        };
      }

      // E7: Ý định: Chỉ đường
      if (intent.type === "GET_DIRECTIONS") {
        return {
          responseMessages: [
            {
              id: `msg-dir-${Date.now()}`,
              sender: "bot",
              text: lang === "vi"
                ? `Bạn có thể xem chỉ đường đến **${placeName}** qua bản đồ nội bộ website hoặc mở Google Maps:`
                : `You can view directions to **${placeName}** on our interactive map or open Google Maps:`,
              actionData: {
                type: "GET_DIRECTIONS",
                placeId: targetPlace.id
              },
              options: [
                { id: "opt-map-go", label: lang === "vi" ? "🗺️ Xem trên bản đồ" : "🗺️ Show on Map", action: "SHOW_ON_MAP", placeId: targetPlace.id },
                { id: "opt-det-go", label: lang === "vi" ? "📖 Xem chi tiết địa điểm" : "📖 Place Details", action: "NAVIGATE_DETAIL", placeId: targetPlace.id }
              ],
              isFallback: true
            }
          ],
          updatedContext: { ...context, selectedPlace: targetPlace, referencePlace: targetPlace }
        };
      }

      // E8: Mặc định: Giới thiệu địa điểm
      return {
        responseMessages: [createPlaceIntroMessage(targetPlace, lang)],
        updatedContext: { ...context, selectedPlace: targetPlace, referencePlace: targetPlace }
      };
    }

    // F. Câu hỏi chưa nhận diện được địa điểm và không thuộc từ khóa du lịch cụ thể
    return {
      responseMessages: [
        {
          id: `msg-${Date.now()}`,
          sender: "bot",
          text:
            lang === "vi"
              ? "Bạn có thể cho mình biết cụ thể tên địa danh (như Dinh Độc Lập, Chợ Bến Thành, Bưu điện, Trường Lê Quý Đôn...) hoặc chọn một trong các gợi ý dưới đây nhé:"
              : "Could you specify a landmark (e.g., Independence Palace, Ben Thanh Market, Le Quy Don...) or pick from below:",
          options: places.map((p) => ({
            id: `btn-${p.id}`,
            label: p.name?.[lang] || p.name?.vi || p.id,
            action: "SELECT_PLACE",
            placeId: p.id
          })),
          isFallback: true
        }
      ],
      updatedContext: context
    };
  }

  return {
    responseMessages: [createWelcomeMessage(lang)],
    updatedContext: { ...context, flow: "MAIN_MENU" }
  };
}
