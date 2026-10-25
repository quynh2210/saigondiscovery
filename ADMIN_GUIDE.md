# 📖 Sổ Tay Quản Trị Viên & Hướng Dẫn Tích Hợp Hệ Thống (ADMIN GUIDE)

Tài liệu này hướng dẫn chi tiết các tính năng mới được nâng cấp: Tải ảnh Cloudinary, Hệ thống Đánh giá 5 sao & Kiểm duyệt, Thư viện ảnh Carousel, Quản lý Ẩm thực & Tọa độ bản đồ, cùng Hướng dẫn kích hoạt **Trợ lý AI Gemini qua Firebase AI Logic**.

---

## 1. Hướng Dẫn Chạy Upload Server Cloudinary

Hệ thống đã loại bỏ hoàn toàn việc lưu ảnh dạng chuỗi Base64 nặng nề vào database. Tất cả hình ảnh (địa điểm, quán ăn, ảnh đánh giá của người dùng) đều được tải lên máy chủ ảnh **Cloudinary** tốc độ cao.

### Cách khởi động Upload Server:
Mở terminal riêng trong thư mục dự án và chạy:
```powershell
npm run server
```
Máy chủ Node.js/Express sẽ khởi động tại `http://localhost:3000`.

- Cấu hình API Key của bạn đã được thiết lập sẵn trong `server/.env`:
  ```env
  CLOUDINARY_NAME=di7xar1oz
  CLOUDINARY_API_KEY=527646629682775
  CLOUDINARY_SECRET_KEY=E5xedysf1e9g8fTEyrBHC3DKC68
  ```
- Khi quản trị viên hoặc khách du lịch bấm tải ảnh, file sẽ được truyền qua endpoint `POST http://localhost:3000/upload` với field `image` và trả về URL ảnh Cloudinary an toàn dạng `https://res.cloudinary.com/...`.

---

## 2. Tính Năng Đánh Giá 5 Sao & Kiểm Duyệt Bình Luận

### Dành cho Khách Du Lịch (Frontend):
1. Tại trang chi tiết mỗi địa điểm (`/places/:id`), tab **⭐ Đánh giá (Reviews)** cho phép người xem:
   - Xem điểm trung bình (VD: 4.9 / 5.0) và tổng số lượt đánh giá.
   - Xem nhận xét, xếp hạng sao và ảnh chụp thực tế từ các du khách khác.
   - Bấm vào ảnh nhỏ để mở xem ảnh phóng to toàn màn hình.
2. Để đăng đánh giá, người dùng **phải đăng nhập**:
   - Bấm **"Đăng nhập bằng Google / Email"**.
   - Hỗ trợ đăng nhập nhanh bằng tài khoản Google (Popup) hoặc đăng ký/đăng nhập bằng Email & Mật khẩu.
   - Chọn số sao (từ 1 đến 5 sao), nhập lời nhận xét (caption tùy chọn) và tải kèm hình ảnh từ điện thoại/máy tính lên Cloudinary.

### Dành cho Quản Trị Viên (Admin):
1. Đăng nhập trang quản trị `/#/admin`.
2. Vào tab **"Đánh giá & Bình luận"**.
3. Bảng kiểm duyệt hiển thị toàn bộ đánh giá trên hệ thống: Tên người dùng, Email, Địa điểm, Số sao, Ảnh đính kèm, Nội dung nhận xét và Ngày đăng.
4. Quản trị viên có nút **"Xóa"** để xóa ngay lập tức bất kỳ bình luận nào vi phạm tiêu chuẩn cộng đồng.

### Quy tắc bảo mật Firestore (`firestore.rules`):
```javascript
match /reviews/{reviewId} {
  allow read: if true; // Mọi người đều xem được đánh giá
  allow create: if request.auth != null && request.resource.data.userId == request.auth.uid; // Phải đăng nhập
  allow update: if request.auth != null && (request.auth.uid == resource.data.userId || isAdmin());
  allow delete: if request.auth != null && (request.auth.uid == resource.data.userId || isAdmin()); // Người đăng hoặc Admin mới được xóa
}
```

---

## 3. Thư Viện Ảnh Carousel Tự Động & Đổi Tên Quận Cũ

1. **Hiển thị Carousel chi tiết địa điểm**:
   - Khi vào xem chi tiết 1 địa điểm, phần ảnh hiển thị dạng **ImageCarousel**.
   - Khi rê chuột (hover) vào khung ảnh, hình ảnh sẽ tự động chạy mượt mà theo chu kỳ mà không làm ảnh bị mờ hay vỡ hạt (`object-fit: cover` giữ nguyên độ sắc nét tối đa).
   - Có nút bấm qua lại (Previous / Next), thanh chấm tròn chuyển ảnh và huy hiệu đếm ảnh (`1 / 4`).
2. **Hover chạy ảnh tại Card Trang Chủ**:
   - Rê chuột vào bất kỳ thẻ địa danh nào trên Trang Chủ, khung ảnh sẽ tự động chuyển đổi qua các ảnh trong thư viện của địa danh đó.
3. **Thêm / Sửa ảnh trong Admin**:
   - Trong bảng chỉnh sửa địa điểm, Admin có thể cập nhật ảnh đại diện chính và thêm/xóa bao nhiêu ảnh vào Carousel tùy thích.
4. **Hiển thị Quận cũ & Đổi ngôn ngữ**:
   - Các nhãn quận đã được cập nhật thành: **Quận 1 (cũ)** và **Quận 3 (cũ)**.
   - Khi bấm chuyển ngôn ngữ sang **GB EN**, các nhãn sẽ tự động chuyển thành **Former District 1** và **Former District 3**.

---

## 4. Quản Lý Địa Điểm & Ẩm Thực Trong Admin

1. **Xóa hoàn toàn địa điểm**:
   - Trước đây khi bấm xóa, địa điểm có thể bị nạp lại do hàm merge demoData.
   - Hệ thống mới đã được trang bị cơ chế **Tombstone Registry** (`_metadata/tombstones` và `localStorage`). Khi xóa một địa điểm trong Admin, địa điểm đó sẽ bị loại bỏ vĩnh viễn và lập tức biến mất trên **Bản đồ**, **Chatbot**, **Trang chủ** và **Admin**.
2. **Nhập thông tin song ngữ (Tiếng Việt & Tiếng Anh)**:
   - Form chỉnh sửa địa điểm cung cấp đầy đủ các cặp ô nhập song ngữ:
     - Tên địa điểm: `name.vi` và `name.en`
     - Địa chỉ: `address.vi` và `address.en`
     - Giờ mở cửa: `openingHours.vi` và `openingHours.en`
     - Giá vé: `ticketPrice.vi` và `ticketPrice.en`
     - Tóm tắt ngắn: `summary.vi` và `summary.en`
     - Mô tả chi tiết: `description.vi` và `description.en`
     - Lịch sử & ý nghĩa: `history.vi` và `history.en`
   - Khi người dùng bấm nút đổi ngôn ngữ **VN | EN** ở thanh điều hướng, toàn bộ thông tin sẽ tự động hiển thị phiên bản ngôn ngữ tương ứng.
3. **Liên kết quán ăn / quán nước với địa điểm**:
   - Trong form chỉnh sửa địa điểm: Có danh sách checkbox tất cả quán ăn/nước để chọn liên kết.
   - Trong form chỉnh sửa quán ăn/nước: Có thể chỉnh sửa Tên, Địa chỉ, Mô tả (song ngữ), Tọa độ bản đồ (`lat`, `lng`), Ảnh Cloudinary và danh sách địa danh liên kết (`placeIds`).
4. **Hiện / Ẩn quán ăn & quán nước trên Bản Đồ**:
   - Trên bản đồ Leaflet có thêm nút điều khiển **"Ẩn quán ăn/uống" / "Hiện quán ăn/uống"**.
   - Các quán ăn hiển thị ghim biểu tượng 🍜 (màu cam), quán nước/cà phê hiển thị ghim ☕ (màu hổ phách). Bấm vào ghim sẽ mở popup xem thông tin và chỉ đường Google Maps. Khi bấm ẩn, bản đồ chỉ hiển thị riêng các địa điểm du lịch.

---

## 5. Hướng Dẫn Tích Hợp Trợ Lý Du Lịch Gemini AI (Firebase AI Logic)

Chatbot du lịch Plunis đã được tái cấu trúc thành trợ lý AI trò chuyện tự nhiên, sử dụng **Firebase AI Logic SDK** (`firebase/ai`) chính thức của Firebase 13.

### A. Kiến trúc mã nguồn của Chatbot:
- `ChatbotWidget.jsx`: Giao diện chính và quản lý trạng thái cửa sổ chat.
- `ChatMessageList.jsx`: Trình hiển thị danh sách tin nhắn, badge "Gemini AI", nút hành động và thẻ quán ăn.
- `QuickReplyButtons.jsx`: Các gợi ý nhanh và nút làm mới cuộc trò chuyện.
- `chatbotAIService.js`: Module giao tiếp trực tiếp với Firebase AI Logic (`getAI`, `getGenerativeModel`, `startChat`).
- `chatbotSystemInstruction.js`: Persona hướng dẫn viên du lịch Sài Gòn thân thiện, hiểu câu hỏi tiếp nối và quy tắc ứng xử.
- `chatbotContext.js`: Tạo bối cảnh dữ liệu du lịch chính xác từ Firestore và quản lý lịch sử hội thoại có giới hạn.
- `chatbotActions.js`: Kiểm tra tính hợp lệ của các hành động website (`SHOW_PLACE`, `SHOW_PLACE_DETAILS`, `RECOMMEND_VENUES`, `OPEN_GOOGLE_MAPS`, `GET_DIRECTIONS`, `FIND_BUS_ROUTES`, `PLAY_AUDIO_GUIDE`, `SHOW_QR`).
- `chatbotFallback.js`: Chế độ dự phòng khi AI chưa cấu hình hoặc mất kết nối mạng.

### B. Các bước cấu hình trên Firebase Console & Google Cloud:
1. **Bật Firebase AI Logic (Google AI on Firebase)**:
   - Truy cập **Firebase Console** (dự án `hcmc-11594`).
   - Vào menu bên trái: Chọn **Build** -> **AI Logic** (hoặc Vertex AI / Google AI).
   - Bấm **Get Started** để bật dịch vụ. Firebase sẽ tự động liên kết với Google Cloud API tương ứng.
2. **Chọn Mô hình Gemini**:
   - Hệ thống mặc định sử dụng mô hình tối ưu về tốc độ và chi phí: `gemini-2.5-flash` (hoặc `gemini-2.0-flash` / `gemini-1.5-flash`).
   - Bạn có thể cấu hình tên mô hình qua biến môi trường trong `.env`:
     ```env
     VITE_GEMINI_MODEL=gemini-2.5-flash
     ```
3. **Cấu hình Firebase App Check (Tùy chọn tăng cường bảo mật)**:
   - Vào **Firebase Console** -> **App Check**.
   - Đăng ký ứng dụng Web với **reCAPTCHA v3** và thêm Site Key vào `.env`:
     ```env
     VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
     ```
   - Trong môi trường phát triển (localhost), bạn có thể thêm Debug Token:
     ```env
     VITE_FIREBASE_APPCHECK_DEBUG_TOKEN=true
     ```
4. **Theo dõi Hạn mức và Chi phí (Quotas & Costs)**:
   - Mở **Google Cloud Console** -> **APIs & Services** -> **Enabled APIs & services** -> **Google AI on Firebase API**.
   - Kiểm tra tab **Quotas** để xem số lượng yêu cầu mỗi phút (RPM), token mỗi phút (TPM).
   - Kiểm tra tab **Billing** để theo dõi chi phí thực tế.
5. **Cơ chế Chuyển đổi Dự phòng (Auto Fallback)**:
   - Nếu dự án chưa bật Firebase AI Logic trên Console hoặc gặp sự cố mạng, chatbot sẽ **tự động chuyển sang chế độ kịch bản dự phòng** mà không làm đơ giao diện hay phát sinh lỗi crash.
   - Tin nhắn trả về bởi AI sẽ có huy hiệu ✨ **Gemini AI**, trong khi tin nhắn dự phòng sẽ có nhãn ⚡ **Sẵn sàng**.
