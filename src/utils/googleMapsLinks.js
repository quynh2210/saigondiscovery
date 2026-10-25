/**
 * Module tiện ích tạo các liên kết Google Maps chuẩn xác
 * Sử dụng Google Maps URL Scheme thông thường (api=1), không yêu cầu Google Maps API Key.
 * Đảm bảo encodeURIComponent an toàn, mở tab mới với target="_blank" rel="noopener noreferrer".
 */

/**
 * Mở tìm kiếm địa điểm trên Google Maps
 * @param {string} query Tên địa điểm hoặc địa chỉ
 * @returns {string} URL Google Maps
 */
export function getSearchUrl(query) {
  if (!query) return "https://www.google.com/maps";
  const cleanQuery = encodeURIComponent(query.trim());
  return `https://www.google.com/maps/search/?api=1&query=${cleanQuery}`;
}

/**
 * Chỉ đường đến địa điểm trên Google Maps
 * Nếu có điểm xuất phát thì điền sẵn, nếu không để trống để người dùng chọn vị trí hiện tại
 * @param {string} destination Tên hoặc địa chỉ điểm đến
 * @param {string} [origin=""] Tên hoặc địa chỉ điểm xuất phát (tùy chọn)
 * @returns {string} URL Chỉ đường Google Maps
 */
export function getDirectionsUrl(destination, origin = "") {
  if (!destination) return "https://www.google.com/maps";
  const destEncoded = encodeURIComponent(destination.trim());
  if (origin && origin.trim()) {
    const origEncoded = encodeURIComponent(origin.trim());
    return `https://www.google.com/maps/dir/?api=1&origin=${origEncoded}&destination=${destEncoded}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${destEncoded}`;
}

/**
 * Tìm tuyến xe buýt / phương tiện công cộng đến địa điểm
 * Google Maps dir với travelmode=transit
 * @param {string} destination Tên hoặc địa chỉ điểm đến
 * @param {string} [origin=""] Điểm xuất phát (tùy chọn)
 * @returns {string} URL Chỉ đường bằng xe buýt
 */
export function getTransitUrl(destination, origin = "") {
  if (!destination) return "https://www.google.com/maps";
  const destEncoded = encodeURIComponent(destination.trim());
  if (origin && origin.trim()) {
    const origEncoded = encodeURIComponent(origin.trim());
    return `https://www.google.com/maps/dir/?api=1&origin=${origEncoded}&destination=${destEncoded}&travelmode=transit`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${destEncoded}&travelmode=transit`;
}

/**
 * Tìm trạm xe buýt gần địa điểm du lịch
 * Tìm kiếm với truy vấn: "trạm xe buýt gần [Tên địa điểm / Địa chỉ]"
 * @param {string} placeName Tên địa điểm hoặc địa chỉ
 * @returns {string} URL tìm kiếm trạm xe buýt
 */
export function getNearbyBusStopsUrl(placeName) {
  if (!placeName) return "https://www.google.com/maps/search/?api=1&query=tram+xe+buyt";
  const query = `trạm xe buýt gần ${placeName.trim()}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Chỉ đường từ một địa điểm tham quan du lịch đến quán ăn / quán nước
 * @param {string} touristPlaceName Tên địa điểm tham quan xuất phát
 * @param {string} venueName Tên quán ăn hoặc địa chỉ quán
 * @returns {string} URL Chỉ đường
 */
export function getVenueDirectionsUrl(touristPlaceName, venueName) {
  return getDirectionsUrl(venueName, touristPlaceName);
}
