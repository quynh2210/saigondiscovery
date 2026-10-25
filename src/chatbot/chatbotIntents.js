/**
 * Nhận diện thực thể và ý định người dùng từ câu hỏi tự do
 * Hỗ trợ tiếng Việt (có dấu và không dấu) và tiếng Anh
 */

export function removeVietnameseTones(str) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

/**
 * Trích xuất danh sách từ khóa phong phú và chính xác cho một địa điểm
 */
export function getPlaceKeywords(place) {
  const kws = new Set();
  const add = (s) => {
    if (!s) return;
    const n = removeVietnameseTones(s);
    if (n.length >= 3) kws.add(n);
  };

  add(place.name?.vi);
  add(place.name?.en);
  add(place.slug);
  add(place.id);

  // Tên rút gọn bỏ phần ngoặc đơn phụ đề: vd "Trường THPT Lê Quý Đôn (Collège...)" -> "Trường THPT Lê Quý Đôn"
  if (place.name?.vi) {
    const cleanVi = place.name.vi.replace(/\(.*?\)/g, "").trim();
    add(cleanVi);
  }
  if (place.name?.en) {
    const cleanEn = place.name.en.replace(/\(.*?\)/g, "").trim();
    add(cleanEn);
  }

  const pId = String(place.id || "").toLowerCase();
  const slug = String(place.slug || "").toLowerCase();

  // 1. Dinh Độc Lập
  if (pId.includes("dinh-doc-lap") || slug.includes("dinh-doc-lap")) {
    [
      "dinh doc lap",
      "dinh thong nhat",
      "hoi truong thong nhat",
      "dinh norodom",
      "norodom",
      "independence palace",
      "reunification hall",
      "reunification palace"
    ].forEach(add);
  }

  // 2. Nhà thờ Đức Bà
  if (pId.includes("duc-ba") || slug.includes("duc-ba")) {
    [
      "nha tho duc ba",
      "duc ba sai gon",
      "duc ba",
      "notre dame",
      "notre-dame",
      "nha tho chinh toa",
      "notre dame cathedral"
    ].forEach(add);
  }

  // 3. Bưu điện Trung tâm
  if (pId.includes("buu-dien") || slug.includes("buu-dien")) {
    [
      "buu dien trung tam",
      "buu dien sai gon",
      "buu dien thanh pho",
      "buu dien q1",
      "buu dien",
      "central post office",
      "saigon post office",
      "post office"
    ].forEach(add);
  }

  // 4. Chợ Bến Thành
  if (pId.includes("ben-thanh") || slug.includes("ben-thanh")) {
    [
      "cho ben thanh",
      "ben thanh",
      "ben thanh market",
      "cho saigon"
    ].forEach(add);
  }

  // 5. Bảo tàng Chứng tích Chiến tranh
  if (pId.includes("chung-tich") || slug.includes("chung-tich") || pId.includes("chien-tranh")) {
    [
      "bao tang chung tich chien tranh",
      "bao tang chung tich",
      "chung tich chien tranh",
      "bao tang chien tranh",
      "war remnants museum",
      "war remnants"
    ].forEach(add);
  }

  // 6. Hồ Con Rùa
  if (pId.includes("con-rua") || slug.includes("con-rua")) {
    [
      "ho con rua",
      "con rua",
      "cong truong quoc te",
      "turtle lake",
      "international square"
    ].forEach(add);
  }

  // 7. Chùa Vĩnh Nghiêm
  if (pId.includes("vinh-nghiem") || slug.includes("vinh-nghiem")) {
    [
      "chua vinh nghiem",
      "vinh nghiem",
      "vinh nghiem pagoda"
    ].forEach(add);
  }

  // 8. Đường Sách Nguyễn Văn Bình
  if (pId.includes("duong-sach") || slug.includes("duong-sach") || pId.includes("nguyen-van-binh")) {
    [
      "duong sach nguyen van binh",
      "duong sach",
      "nguyen van binh",
      "book street",
      "saigon book street"
    ].forEach(add);
  }

  // 9. Nhà hát Thành phố
  if (pId.includes("nha-hat") || slug.includes("nha-hat")) {
    [
      "nha hat thanh pho",
      "nha hat lon sai gon",
      "nha hat lon",
      "nha hat q1",
      "opera house",
      "saigon opera house",
      "municipal theatre"
    ].forEach(add);
  }

  // 10. Trường THPT Lê Quý Đôn
  if (pId.includes("le-quy-don") || slug.includes("le-quy-don")) {
    [
      "truong thpt le quy don",
      "truong le quy don",
      "thpt le quy don",
      "le quy don",
      "chasseloup-laubat",
      "chasseloup laubat",
      "chasseloup",
      "le quy don high school"
    ].forEach(add);
  }

  // 11. Bảo tàng Mỹ thuật
  if (pId.includes("my-thuat") || slug.includes("my-thuat")) {
    [
      "bao tang my thuat",
      "my thuat thanh pho",
      "my thuat tphcm",
      "my thuat",
      "nha chu hoa",
      "dinh thu chu hoa",
      "fine arts museum",
      "museum of fine arts",
      "fine arts"
    ].forEach(add);
  }

  // 12. Chùa Xá Lợi
  if (pId.includes("xa-loi") || slug.includes("xa-loi")) {
    [
      "chua xa loi",
      "xa loi",
      "xa loi pagoda"
    ].forEach(add);
  }

  // Sắp xếp các từ khóa dài nhất lên trước để ưu tiên so khớp chính xác tuyệt đối
  return Array.from(kws).sort((a, b) => b.length - a.length);
}

/**
 * Tìm kiếm địa điểm phù hợp nhất từ câu hỏi người dùng
 */
export function findMatchingPlace(rawText, places = []) {
  if (!rawText || !places || places.length === 0) return null;
  const norm = removeVietnameseTones(rawText);

  let bestPlace = null;
  let maxKeywordLength = 0;

  for (const place of places) {
    const kws = getPlaceKeywords(place);
    for (const kw of kws) {
      if (norm.includes(kw)) {
        if (kw.length > maxKeywordLength) {
          maxKeywordLength = kw.length;
          bestPlace = place;
        }
      }
    }
  }

  return bestPlace;
}

/**
 * Phân tích câu hỏi người dùng để xác định Ý định (Intent) và Địa điểm liên quan (Place)
 */
export function analyzeUserIntent(rawText, places = [], context = {}) {
  const text = String(rawText || "").toLowerCase().trim();
  const normalized = removeVietnameseTones(text);

  if (!normalized) {
    return { type: "UNKNOWN" };
  }

  // 1. Chào hỏi xã giao (Greetings)
  if (
    normalized === "chao" ||
    normalized === "xin chao" ||
    normalized === "chao ban" ||
    normalized === "hi" ||
    normalized === "hello" ||
    normalized === "hey" ||
    normalized.startsWith("xin chao") ||
    normalized.startsWith("chao ban") ||
    normalized.startsWith("hello")
  ) {
    // Chỉ là chào hỏi nếu câu ngắn dưới 4 từ
    if (normalized.split(" ").length <= 4) {
      return { type: "GREETING" };
    }
  }

  // Cảm ơn (Thanks)
  if (
    normalized === "cam on" ||
    normalized === "cam on ban" ||
    normalized === "thank you" ||
    normalized === "thanks" ||
    normalized.startsWith("cam on")
  ) {
    if (normalized.split(" ").length <= 4) {
      return { type: "THANKS" };
    }
  }

  // 2. Tìm địa điểm đích danh được nhắc đến trong câu hỏi
  const matchedPlace = findMatchingPlace(normalized, places);

  // Kiểm tra xem câu hỏi có chứa đại từ chỉ địa điểm đã chọn trước đó không (ví dụ "ở đó", "chỗ này", "nơi này", "tại đây", "quán gần đó")
  const hasFollowUpPronoun =
    normalized.includes("o do") ||
    normalized.includes("cho nay") ||
    normalized.includes("noi nay") ||
    normalized.includes("gan do") ||
    normalized.includes("tai day") ||
    normalized.includes("around there") ||
    normalized.includes("near there") ||
    normalized.includes("at this place");

  // Địa điểm hiệu lực: ưu tiên địa điểm tìm được trong câu, chỉ dùng context nếu có đại từ nối tiếp
  const effectivePlace = matchedPlace || (hasFollowUpPronoun ? context.selectedPlace || context.referencePlace : null);

  // 3. Phân loại Ý định theo Keyword chuyên ngành du lịch

  // --- A. ĐỊA CHỈ (ADDRESS) ---
  const isAddressQuery =
    normalized.includes("dia chi") ||
    normalized.includes("address") ||
    normalized.includes("o dau") ||
    normalized.includes("toa lac o") ||
    normalized.includes("vi tri o dau") ||
    normalized.includes("nam o dau") ||
    normalized.includes("where is") ||
    normalized.includes("located at");

  if (isAddressQuery) {
    if (effectivePlace) {
      return { type: "ASK_ADDRESS", place: effectivePlace };
    }
    return { type: "LIST_PLACES_FOR_ADDRESS" };
  }

  // --- B. THUYẾT MINH ÂM THANH (AUDIO GUIDE) ---
  const isAudioQuery =
    normalized.includes("thuyet minh") ||
    normalized.includes("audio") ||
    normalized.includes("nghe audio") ||
    normalized.includes("nghe thuyet minh") ||
    normalized.includes("phat am thanh") ||
    normalized.includes("listen to audio") ||
    normalized.includes("audio guide") ||
    normalized.includes("voice guide");

  if (isAudioQuery) {
    if (effectivePlace) {
      return { type: "ASK_AUDIO", place: effectivePlace };
    }
    return { type: "LIST_PLACES_FOR_AUDIO" };
  }

  // --- C. QUÁN ĂN / ẨM THỰC (FOOD) ---
  const isFoodQuery =
    normalized.includes("quan an") ||
    normalized.includes("an gi") ||
    normalized.includes("mon ngon") ||
    normalized.includes("an uong") ||
    normalized.includes("nha hang") ||
    normalized.includes("food") ||
    normalized.includes("restaurant") ||
    normalized.includes("eat") ||
    normalized.includes("com tam") ||
    normalized.includes("pho") ||
    normalized.includes("banh mi");

  if (isFoodQuery) {
    if (effectivePlace) {
      return { type: "FIND_FOOD", category: "restaurant", place: effectivePlace };
    }
    return { type: "LIST_PLACES_FOR_FOOD" };
  }

  // --- D. QUÁN NƯỚC / CÀ PHÊ (DRINKS & CAFES) ---
  const isDrinkQuery =
    normalized.includes("quan nuoc") ||
    normalized.includes("ca phe") ||
    normalized.includes("cafe") ||
    normalized.includes("coffee") ||
    normalized.includes("uong gi") ||
    normalized.includes("tra sua") ||
    normalized.includes("drink");

  if (isDrinkQuery) {
    if (effectivePlace) {
      return { type: "FIND_DRINKS", category: "drink", place: effectivePlace };
    }
    return { type: "LIST_PLACES_FOR_DRINK" };
  }

  // --- E. LỊCH SỬ DI TÍCH (HISTORY) ---
  const isHistoryQuery =
    normalized.includes("lich su") ||
    normalized.includes("history") ||
    normalized.includes("xay nam nao") ||
    normalized.includes("xua kia") ||
    normalized.includes("nguon goc") ||
    normalized.includes("cau chuyen");

  if (isHistoryQuery) {
    if (effectivePlace) {
      return { type: "ASK_HISTORY", place: effectivePlace };
    }
    return { type: "LIST_ALL_PLACES" };
  }

  // --- F. GIÁ VÉ & GIỜ MỞ CỬA (PRACTICAL VISIT INFO) ---
  const isPracticalQuery =
    normalized.includes("gia ve") ||
    normalized.includes("ve vao cong") ||
    normalized.includes("bao nhieu tien") ||
    normalized.includes("ticket") ||
    normalized.includes("gio mo cua") ||
    normalized.includes("opening hours") ||
    normalized.includes("may gio mo") ||
    normalized.includes("dong cua") ||
    normalized.includes("open time");

  if (isPracticalQuery) {
    if (effectivePlace) {
      return { type: "ASK_PRACTICAL", place: effectivePlace };
    }
    return { type: "LIST_ALL_PLACES" };
  }

  // --- G. BẢN ĐỒ & CHỈ ĐƯỜNG (MAP & DIRECTIONS) ---
  if (
    normalized.includes("chi duong") ||
    normalized.includes("duong di") ||
    normalized.includes("directions") ||
    normalized.includes("how to get")
  ) {
    return { type: "GET_DIRECTIONS", place: effectivePlace };
  }

  if (
    normalized.includes("ban do") ||
    normalized.includes("xem tren ban do") ||
    normalized.includes("open map") ||
    normalized.includes("show map")
  ) {
    return { type: "VIEW_MAP", place: effectivePlace };
  }

  // --- H. XE BUÝT / GIAO THÔNG (BUS & TRANSIT) ---
  if (
    normalized.includes("xe buyt") ||
    normalized.includes("xe bus") ||
    normalized.includes("tuyen xe") ||
    normalized.includes("tram xe buyt") ||
    normalized.includes("bus route")
  ) {
    return { type: "BUS_ROUTES", place: effectivePlace };
  }

  // --- I. MÃ QR CODE ---
  if (
    normalized.includes("ma qr") ||
    normalized.includes("qr code") ||
    normalized.includes("scan qr")
  ) {
    return { type: "QR_CODE", place: effectivePlace };
  }

  // --- J. DANH SÁCH / THÔNG TIN CHUNG KHÔNG RÕ ĐỊA ĐIỂM ---
  if (
    normalized.includes("thong tin") ||
    normalized.includes("danh sach dia diem") ||
    normalized.includes("cac dia diem") ||
    normalized.includes("dia danh") ||
    normalized.includes("kham pha") ||
    normalized.includes("attractions") ||
    normalized.includes("places to visit") ||
    normalized.includes("list places")
  ) {
    if (effectivePlace) {
      return { type: "ASK_PLACE_INFO", place: effectivePlace };
    }
    return { type: "LIST_ALL_PLACES" };
  }

  // --- K. NẾU CÂU HỎI CHỈ NÓI TÊN ĐỊA ĐIỂM HOẶC HỎI VỀ ĐỊA ĐIỂM ĐÓ ---
  if (matchedPlace) {
    return {
      type: "ASK_PLACE_INFO",
      place: matchedPlace
    };
  }

  // --- L. ĐẶT LẠI MENU ---
  if (
    normalized === "menu" ||
    normalized === "lam moi" ||
    normalized === "reset" ||
    normalized === "bat dau lai"
  ) {
    return { type: "RESET_MENU" };
  }

  // --- M. KHÔNG THUỘC TỪ KHÓA CỐ ĐỊNH -> CHUYỂN SANG GEMINI AI XỬ LÝ HỘI THOẠI TỰ NHIÊN ---
  return { type: "UNKNOWN" };
}
