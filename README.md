# 🏛️ Sài Gòn Discovery — Website Bản Đồ Du Lịch TP. Hồ Chí Minh (Quận 1 & Quận 3)

Website du lịch tương tác hiện đại, trực quan, hỗ trợ song ngữ (Tiếng Việt & English), được xây dựng bằng **React + Vite + Leaflet + Firebase**. Dự án tập trung giới thiệu và hỗ trợ khám phá các di tích lịch sử, công trình kiến trúc biểu tượng và nền ẩm thực nức tiếng tại **Quận 1 và Quận 3, Thành phố Hồ Chí Minh**.

---

## 🌟 Tính Năng Nổi Bật

1. **Bản đồ du lịch tương tác (Interactive Leaflet Map)**:
   - Sử dụng Leaflet và nguồn bản đồ nền **OpenStreetMap** (kèm đầy đủ bản quyền ghi công ODbL).
   - Ghim địa điểm tùy chỉnh màu sắc và biểu tượng theo danh mục (Di tích lịch sử, Kiến trúc, Văn hóa, Tâm linh).
   - Hiệu ứng radar pulse cho địa điểm đang chọn, xem popup nhanh và di chuyển bản đồ mượt mà (smooth flyTo).
   - Thanh tìm kiếm địa danh (hỗ trợ tiếng Việt có dấu và không dấu) cùng bộ lọc nhanh theo Quận (Quận 1, Quận 3) và Danh mục.
   - Nút đặt lại góc nhìn mặc định (Reset View) và Chú giải bản đồ (Legend).

2. **Tích hợp chỉ đường Google Maps (Không tốn phí API)**:
   - Tất cả liên kết được chuẩn hóa qua URL Scheme của Google Maps (`api=1`):
     - **Chỉ đường đến đây**: Tự động mở Google Maps với điểm đến đã chọn.
     - **Tìm tuyến xe buýt**: Mở Google Maps ở chế độ phương tiện công cộng (`travelmode=transit`).
     - **Trạm xe buýt gần đây**: Mở truy vấn tìm trạm xe buýt xung quanh di tích.
     - **Chỉ đường đến quán ăn**: Tự động điền điểm xuất phát là di tích du lịch và điểm đến là quán ăn/quán cà phê.

3. **Chatbot Linh vật Tour Guide thông minh (Bé Nón Lá)**:
   - Linh vật nổi ở góc phải màn hình với hiệu ứng nhịp thở thu hút người dùng.
   - Luồng hội thoại theo kịch bản rõ ràng:
     - *Luồng 1*: Tìm hiểu địa điểm (nhận diện địa điểm đang xem trên website, giới thiệu, mở bản đồ, nghe thuyết minh, lịch sử).
     - *Luồng 2*: Gợi ý ăn uống (chọn di tích tham chiếu -> chọn quán ăn/quán nước -> mở Google Maps).
     - *Luồng 3*: Chỉ đường & xe buýt.
   - Xử lý câu hỏi tự do bằng bộ phân tích từ khóa và ý định tiếng Việt/Anh.
   - Kiến trúc tách biệt (`chatbotService.js`), sẵn sàng kết nối mô hình AI backend khi có nhu cầu.

4. **Trang Ẩm thực & Cà phê Sài Gòn (Food & Drinks Guide)**:
   - Phân loại rõ ràng giữa Quán ăn (Restaurants) và Quán nước / Cà phê (Cafes & Drinks).
   - Lọc theo địa danh tham quan lân cận.
   - Nút mở vị trí quán trên Google Maps và chỉ đường từ điểm tham quan.

5. **Trình phát Thuyết minh (Audio Guide) & Mã QR**:
   - Trình phát Audio Guide HTML5 song ngữ (VI / EN) với thanh trượt tiến trình và thời lượng.
   - Tự động tạm dừng nhạc nền khi người dùng bấm nghe thuyết minh.
   - Hộp thoại mã QR phóng to, hỗ trợ tải ảnh QR về điện thoại.
   - Trình phát nhạc nền nhẹ nhàng (tắt mặc định, thư thái với âm sắc ngũ cung truyền thống).

6. **Hệ thống Quản trị CMS (/admin) & Bảo mật Firebase**:
   - Xác thực quản trị viên bằng Email & Password qua Firebase Authentication.
   - Cơ chế bảo mật kép: Kiểm tra UID của tài khoản trong Firestore collection `admins`.
   - Bộ quy tắc bảo mật `firestore.rules`: Khách chỉ đọc tài liệu `published == true`, chỉ admin mới được tạo/sửa/xóa.
   - Quản lý toàn diện: Thêm, sửa, ẩn/hiện (`published`) địa điểm và ẩm thực.
   - **Nút 1-Click "Đồng bộ dữ liệu mẫu lên Firestore" (Seed Demo Data)**: Giúp nạp toàn bộ dữ liệu mẫu Quận 1 & 3 lên Firebase trong vài giây.

7. **Chế độ Chạy Thông Minh (Dual Mode)**:
   - **Demo Mode**: Tự động kích hoạt khi chưa có cấu hình Firebase trong `.env`. Website và trang quản trị vẫn hoạt động 100% với bộ dữ liệu mẫu phong phú mà không bao giờ bị lỗi crash màn hình trắng.
   - **Firebase Mode**: Tự động chuyển đổi khi bạn điền thông tin cấu hình Firebase vào `.env`.

---
