/**
 * Từ điển song ngữ Anh - Việt cho toàn bộ hệ thống giao diện
 */

export const translations = {
  vi: {
    // Nav
    navHome: "Trang chủ",
    navMap: "Bản đồ",
    navAbout: "Giới thiệu",
    navFood: "Ẩm thực",
    navAdmin: "Quản trị",
    tagline: "Bản đồ du lịch TP. Hồ Chí Minh",

    // Hero
    heroBadge: "Khám phá TP. Hồ Chí Minh • Quận 1 & Quận 3",
    exploreMap: "Khám phá bản đồ",
    viewHighlights: "Xem địa điểm nổi bật",

    // Map Page
    mapTitle: "Bản Đồ Du Lịch Tương Tác",
    mapSubtitle: "Khám phá các di tích lịch sử, kiến trúc cổ kính và văn hóa đặc sắc tại Quận 1 và Quận 3",
    searchPlaceholder: "Tìm kiếm địa điểm, địa chỉ...",
    filterAll: "Tất cả",
    filterDistrict1: "Quận 1 (cũ)",
    filterDistrict3: "Quận 3 (cũ)",
    catHistorical: "Di tích lịch sử",
    catArchitecture: "Kiến trúc",
    catCulture: "Văn hóa & Điểm hẹn",
    catSpiritual: "Tâm linh & Chùa chiền",
    catOther: "Khác",
    resetMap: "Đặt lại bản đồ",
    legend: "Chú giải bản đồ",
    placesCount: "địa điểm",
    noPlacesFound: "Không tìm thấy địa điểm phù hợp với tìm kiếm của bạn.",

    // Detail Panel
    viewDetails: "Xem chi tiết",
    backToList: "Quay lại danh sách",
    openingHours: "Giờ mở cửa",
    ticketPrice: "Giá vé tham quan",
    phone: "Số điện thoại",
    address: "Địa chỉ",
    historyTitle: "Lịch sử & Giá trị văn hóa",
    highlightsTitle: "Điểm nổi bật khi tham quan",
    audioGuideTitle: "Thuyết minh Audio Guide",
    qrTitle: "Quét mã để xem nguồn thông tin",
    scanQR: "Quét mã để xem trên điện thoại",
    updating: "Đang cập nhật",
    free: "Miễn phí",

    // Maps Actions
    getDirections: "Chỉ đường đến đây",
    findBusRoutes: "Tìm tuyến xe buýt",
    findNearbyBusStops: "Trạm xe buýt gần đây",

    // Food & Drinks
    foodTitle: "Gợi Ý Ẩm Thực Lân Cận",
    foodSubtitle: "Khám phá hương vị Sài Gòn xung quanh các địa danh lịch sử",
    tabAllVenues: "Tất cả",
    tabRestaurants: "Quán ăn",
    tabCafes: "Quán nước / Cà phê",
    viewOnMap: "Xem trên Google Maps",
    directionsFromPlace: "Chỉ đường từ điểm tham quan",
    nearPlace: "Gần địa điểm:",
    allFoodHeading: "Thiên Đường Ẩm Thực Sài Gòn",
    noVenuesFound: "Chưa có gợi ý quán ăn cho bộ lọc này. Dữ liệu đang được cập nhật.",

    // Chatbot
    mascotName: "Plunis",
    mascotRole: "Hướng dẫn viên du lịch Sài Gòn",
    chatWelcome: "Xin chào! Mình là Plunis - hướng dẫn viên du lịch của bạn tại Thành phố Hồ Chí Minh. Hôm nay bạn muốn khám phá điều gì?",
    quickOption1: "Tìm hiểu về một địa điểm",
    quickOption2: "Tìm quán ăn hoặc quán nước",
    quickOption3: "Tìm đường và phương tiện di chuyển",
    quickOption4: "Xem bản đồ du lịch",
    inputPlaceholder: "Hỏi về địa điểm, ăn uống, xe buýt...",
    send: "Gửi",
    thinking: "Đang xử lý thông tin...",
    backToMenu: "Menu chính",
    backStep: "Quay lại",
    newConversation: "Cuộc trò chuyện mới",
    showOnMapBtn: "Xem trên bản đồ",
    listenAudioBtn: "Nghe thuyết minh",
    viewQRBtn: "Xem mã QR",
    askHistoryBtn: "Hỏi về lịch sử",
    chooseAnotherPlace: "Chọn địa điểm khác",
    whichPlacePrompt: "Bạn muốn tìm hiểu địa điểm nào trong danh sách dưới đây?",
    whichAreaForFood: "Bạn muốn tìm món ăn hay thức uống gần địa điểm nào?",
    whichDestinationPrompt: "Bạn muốn tìm đường đến địa danh nào?",
    chatUnclear: "Xin lỗi, mình chưa hiểu rõ yêu cầu. Bạn có thể chọn một trong các gợi ý dưới đây hoặc chọn lại địa điểm nhé!",

    // Audio & Music
    bgMusic: "Nhạc nền",
    bgMusicTip: "Bật / Tắt nhạc nền thư giãn (tự tắt khi nghe thuyết minh)",
    playing: "Đang phát",
    paused: "Tạm dừng",

    // Admin
    adminTitle: "Trang Quản Trị Hệ Thống",
    adminSubtitle: "Quản lý dữ liệu địa điểm du lịch, ẩm thực và nội dung website",
    loginTitle: "Đăng nhập Quản trị viên",
    emailLabel: "Email quản trị",
    passwordLabel: "Mật khẩu",
    loginBtn: "Đăng nhập",
    logoutBtn: "Đăng xuất",
    unauthorizedMsg: "Tài khoản của bạn không có quyền quản trị viên (UID không có trong danh sách admins).",
    demoModeNotice: "Chế độ Demo: Bạn chưa cấu hình biến môi trường Firebase (.env). Dữ liệu đang được tải từ bộ nhớ mẫu.",
    seedDataBtn: "Đồng bộ dữ liệu mẫu lên Firestore",
    seedSuccess: "Đã nạp thành công bộ dữ liệu mẫu lên Cloud Firestore!",
    managePlaces: "Quản lý địa điểm",
    manageVenues: "Quản lý ẩm thực",
    createNew: "Thêm mới",
    save: "Lưu thay đổi",
    cancel: "Hủy",
    delete: "Xóa",
    statusPublished: "Đã xuất bản",
    statusDraft: "Bản nháp",

    // Footer
    footerDesc: "Cổng thông tin và bản đồ du lịch tương tác Quận 1 & Quận 3, Thành phố Hồ Chí Minh. Dự án phục vụ mục đích học tập và quảng bá văn hóa du lịch.",
    osmAttribution: "Dữ liệu bản đồ được cung cấp bởi OpenStreetMap (ODbL).",
    backToTop: "Về đầu trang"
  },
  en: {
    // Nav
    navHome: "Home",
    navMap: "Interactive Map",
    navAbout: "About City",
    navFood: "Food & Drinks",
    navAdmin: "Admin",
    tagline: "Ho Chi Minh City Tourism Map",

    // Hero
    heroBadge: "Explore Ho Chi Minh City • District 1 & 3",
    exploreMap: "Explore the Map",
    viewHighlights: "View Highlights",

    // Map Page
    mapTitle: "Interactive Tourism Map",
    mapSubtitle: "Discover historic monuments, colonial architecture, and lively culture across District 1 and District 3",
    searchPlaceholder: "Search places, addresses...",
    filterAll: "All",
    filterDistrict1: "Former District 1",
    filterDistrict3: "Former District 3",
    catHistorical: "Historic Sites",
    catArchitecture: "Architecture",
    catCulture: "Culture & Landmarks",
    catSpiritual: "Spiritual & Temples",
    catOther: "Other",
    resetMap: "Reset View",
    legend: "Map Legend",
    placesCount: "places",
    noPlacesFound: "No places match your search criteria.",

    // Detail Panel
    viewDetails: "View Details",
    backToList: "Back to List",
    openingHours: "Opening Hours",
    ticketPrice: "Admission",
    phone: "Phone",
    address: "Address",
    historyTitle: "History & Heritage",
    highlightsTitle: "Visit Highlights",
    audioGuideTitle: "Audio Guide",
    qrTitle: "Scan to view information sources",
    scanQR: "Scan to open on smartphone",
    updating: "Updating",
    free: "Free",

    // Maps Actions
    getDirections: "Get Directions",
    findBusRoutes: "Find Bus Routes",
    findNearbyBusStops: "Nearby Bus Stops",

    // Food & Drinks
    foodTitle: "Nearby Culinary Gems",
    foodSubtitle: "Taste authentic flavors around historic landmarks",
    tabAllVenues: "All",
    tabRestaurants: "Restaurants",
    tabCafes: "Cafes & Drinks",
    viewOnMap: "View on Google Maps",
    directionsFromPlace: "Directions from Attraction",
    nearPlace: "Near:",
    allFoodHeading: "Saigon Food & Cafe Guide",
    noVenuesFound: "No food & drink venues found for this filter. Data is being updated.",

    // Chatbot
    mascotName: "Plunis",
    mascotRole: "Saigon Tour Guide",
    chatWelcome: "Hello! I am Plunis - your tour guide for Ho Chi Minh City. What would you like to explore today?",
    quickOption1: "Learn about a place",
    quickOption2: "Find food and drinks",
    quickOption3: "Directions & transportation",
    quickOption4: "Explore the map",
    inputPlaceholder: "Ask about places, food, buses...",
    send: "Send",
    thinking: "Gathering information...",
    backToMenu: "Main Menu",
    backStep: "Back",
    newConversation: "New Chat",
    showOnMapBtn: "Show on Map",
    listenAudioBtn: "Listen to Audio Guide",
    viewQRBtn: "View QR Code",
    askHistoryBtn: "Ask about History",
    chooseAnotherPlace: "Choose another place",
    whichPlacePrompt: "Which place would you like to explore from the list below?",
    whichAreaForFood: "Near which attraction are you looking for food or drinks?",
    whichDestinationPrompt: "Which destination do you need directions to?",
    chatUnclear: "I couldn't quite understand your request. You can pick one of the options below or choose a place to start!",

    // Audio & Music
    bgMusic: "Background Music",
    bgMusicTip: "Toggle relaxing ambient music (auto-mutes during audio guides)",
    playing: "Playing",
    paused: "Paused",

    // Admin
    adminTitle: "System Administration",
    adminSubtitle: "Manage tourist places, culinary venues, and website contents",
    loginTitle: "Admin Login",
    emailLabel: "Admin Email",
    passwordLabel: "Password",
    loginBtn: "Sign In",
    logoutBtn: "Sign Out",
    unauthorizedMsg: "Access Denied: Your account UID is not registered in the 'admins' collection.",
    demoModeNotice: "Demo Mode Active: Firebase configuration (.env) is not detected. Using local mock data.",
    seedDataBtn: "Seed Demo Data to Firestore",
    seedSuccess: "Demo data successfully seeded to Cloud Firestore!",
    managePlaces: "Manage Places",
    manageVenues: "Manage Food & Drinks",
    createNew: "Add New",
    save: "Save Changes",
    cancel: "Cancel",
    delete: "Delete",
    statusPublished: "Published",
    statusDraft: "Draft",

    // Footer
    footerDesc: "Interactive tourism portal for District 1 & District 3, Ho Chi Minh City. Built for educational and cultural promotion purposes.",
    osmAttribution: "Map data © OpenStreetMap contributors (ODbL).",
    backToTop: "Back to Top"
  }
};

/**
 * Định dạng tên quận theo ngôn ngữ (Quận 1 (cũ), Quận 3 (cũ) / Former District 1, Former District 3)
 */
export function formatDistrict(district, lang = "vi") {
  if (!district) return "";
  const dStr = String(district).trim().toLowerCase();
  if (dStr.includes("1")) {
    return lang === "vi" ? "Quận 1 (cũ)" : "Former District 1";
  }
  if (dStr.includes("3")) {
    return lang === "vi" ? "Quận 3 (cũ)" : "Former District 3";
  }
  return district;
}

