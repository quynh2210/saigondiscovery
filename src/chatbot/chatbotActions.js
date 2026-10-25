import { 
  getDirectionsUrl, 
  getTransitUrl, 
  getNearbyBusStopsUrl 
} from "../utils/googleMapsLinks";

/**
 * Trích xuất khối hành động từ câu trả lời của AI
 * Hỗ trợ các định dạng:
 * ```action
 * {"action": "SHOW_PLACE", "placeId": "..."}
 * ```
 */
export function extractActionFromAIResponse(responseText) {
  if (!responseText || typeof responseText !== "string") {
    return { cleanedText: responseText || "", actionPayload: null };
  }

  const actionBlockRegex = /```(?:action|json)?\s*(\{\s*"action"[\s\S]*?\})\s*```/i;
  const match = responseText.match(actionBlockRegex);

  if (!match) {
    return { cleanedText: responseText.trim(), actionPayload: null };
  }

  let actionPayload = null;
  try {
    actionPayload = JSON.parse(match[1]);
  } catch (err) {
    console.warn("Failed to parse action JSON from AI response:", err);
  }

  // Loại bỏ khối action khỏi văn bản hiển thị cho người dùng
  const cleanedText = responseText.replace(actionBlockRegex, "").trim();

  return {
    cleanedText,
    actionPayload
  };
}

/**
 * Kiểm tra tính hợp lệ của hành động bằng dữ liệu Firestore đã xác minh
 */
export function validateAndBuildWebsiteAction(actionPayload, places = [], venues = [], lang = "vi") {
  if (!actionPayload || !actionPayload.action) {
    return null;
  }

  const { action, placeId, category } = actionPayload;

  // Xác minh địa điểm tồn tại trong Firestore
  const matchedPlace = places.find(
    (p) => p.id === placeId || p.slug === placeId || (placeId && p.id?.includes(placeId))
  );

  const placeName = matchedPlace
    ? matchedPlace.name?.[lang] || matchedPlace.name?.vi || matchedPlace.name?.en
    : null;
  const placeAddress = matchedPlace
    ? matchedPlace.address?.[lang] || matchedPlace.address?.vi || matchedPlace.address?.en
    : null;

  switch (action) {
    case "SHOW_PLACE":
      if (!matchedPlace) return null;
      return {
        type: "SHOW_PLACE",
        placeId: matchedPlace.id,
        place: matchedPlace,
        buttons: [
          {
            id: "btn-show-map",
            label: lang === "vi" ? `📍 Xem ${placeName} trên bản đồ` : `📍 View ${placeName} on Map`,
            action: "SHOW_ON_MAP",
            placeId: matchedPlace.id
          },
          {
            id: "btn-view-detail",
            label: lang === "vi" ? "📖 Xem toàn bộ chi tiết" : "📖 View Full Details",
            action: "NAVIGATE_DETAIL",
            placeId: matchedPlace.id
          }
        ]
      };

    case "SHOW_PLACE_DETAILS":
      if (!matchedPlace) return null;
      return {
        type: "SHOW_PLACE_DETAILS",
        placeId: matchedPlace.id,
        buttons: [
          {
            id: "btn-view-detail",
            label: lang === "vi" ? `📖 Mở trang chi tiết ${placeName}` : `📖 Open details for ${placeName}`,
            action: "NAVIGATE_DETAIL",
            placeId: matchedPlace.id
          }
        ]
      };

    case "RECOMMEND_VENUES": {
      if (!matchedPlace) return null;
      const targetCategory = category || "all";
      const linked = venues.filter((v) => {
        if (!Array.isArray(v.placeIds) || !v.placeIds.includes(matchedPlace.id)) return false;
        if (targetCategory === "restaurant" && v.type !== "restaurant") return false;
        if (targetCategory === "drink" && v.type !== "drink") return false;
        return true;
      });

      return {
        type: "RECOMMEND_VENUES",
        placeId: matchedPlace.id,
        placeName,
        venues: linked.slice(0, 4),
        buttons: [
          {
            id: "btn-all-food",
            label: lang === "vi" ? "🍜 Xem trang ẩm thực đầy đủ" : "🍜 View All Food Page",
            action: "EXTERNAL_LINK",
            url: "#/food"
          }
        ]
      };
    }

    case "OPEN_GOOGLE_MAPS": {
      if (!matchedPlace) return null;
      const safeMapsUrl = getDirectionsUrl(placeAddress || placeName);
      return {
        type: "OPEN_GOOGLE_MAPS",
        placeId: matchedPlace.id,
        url: safeMapsUrl,
        buttons: [
          {
            id: "btn-gmaps",
            label: lang === "vi" ? "🗺️ Mở Google Maps" : "🗺️ Open Google Maps",
            action: "EXTERNAL_LINK",
            url: safeMapsUrl
          }
        ]
      };
    }

    case "GET_DIRECTIONS": {
      if (!matchedPlace) return null;
      const dirUrl = getDirectionsUrl(placeAddress || placeName);
      return {
        type: "GET_DIRECTIONS",
        placeId: matchedPlace.id,
        url: dirUrl,
        buttons: [
          {
            id: "btn-directions",
            label: lang === "vi" ? "🚗 Chỉ đường đến đây" : "🚗 Get Directions",
            action: "EXTERNAL_LINK",
            url: dirUrl
          }
        ]
      };
    }

    case "FIND_BUS_ROUTES": {
      if (!matchedPlace) return null;
      const transitUrl = getTransitUrl(placeAddress || placeName);
      const nearbyBusUrl = getNearbyBusStopsUrl(placeName);
      return {
        type: "FIND_BUS_ROUTES",
        placeId: matchedPlace.id,
        buttons: [
          {
            id: "btn-bus-routes",
            label: lang === "vi" ? "🚌 Tuyến xe buýt đến đây" : "🚌 Bus Routes",
            action: "EXTERNAL_LINK",
            url: transitUrl
          },
          {
            id: "btn-nearby-stops",
            label: lang === "vi" ? "🚏 Trạm buýt lân cận" : "🚏 Nearby Bus Stops",
            action: "EXTERNAL_LINK",
            url: nearbyBusUrl
          }
        ]
      };
    }

    case "PLAY_AUDIO_GUIDE": {
      if (!matchedPlace) return null;
      const audioUrl = matchedPlace.audioGuide?.[lang]?.url || matchedPlace.audioGuide?.vi?.url || matchedPlace.audioGuide?.url;
      return {
        type: "PLAY_AUDIO_GUIDE",
        placeId: matchedPlace.id,
        audioData: matchedPlace.audioGuide,
        placeName,
        hasAudio: Boolean(audioUrl)
      };
    }

    case "SHOW_QR": {
      if (!matchedPlace) return null;
      return {
        type: "SHOW_QR",
        placeId: matchedPlace.id,
        qrData: matchedPlace.qrGuide,
        placeName
      };
    }

    default:
      console.warn("Unsupported chatbot action:", action);
      return null;
  }
}
