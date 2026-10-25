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

## 🛠️ Công Nghệ Sử Dụng

- **Frontend Core**: React 19, Vite 8, JavaScript (ES Modules)
- **Bản đồ**: Leaflet 1.9, React-Leaflet 5, OpenStreetMap Tiles
- **Icon**: Lucide React
- **Định tuyến**: React Router DOM 7 (`HashRouter` tương thích mọi máy chủ tĩnh)
- **Backend & Cơ sở dữ liệu**: Firebase 13 (Cloud Firestore, Firebase Authentication)
- **Styling**: CSS Modules / Modern Vanilla CSS với CSS Variables & Responsive Layout

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Localhost)

### Bước 1: Mở thư mục dự án
Trong PowerShell hoặc Terminal tại thư mục `hcmc`:

```powershell
# Kiểm tra dependencies đã cài đặt
npm.cmd install
```

### Bước 2: Khởi chạy môi trường phát triển & Upload Server
Mở 2 cửa sổ terminal:

1. **Khởi chạy Cloudinary Upload Server (Port 3000)**:
```powershell
npm.cmd run server
```

2. **Khởi chạy ứng dụng Web Frontend (Port 5173)**:
```powershell
npm.cmd run dev
```

Sau khi chạy lệnh, mở trình duyệt tại địa chỉ hiển thị trên màn hình (thường là `http://localhost:5173`).

### Bước 3: Đăng nhập thử nghiệm trang Quản trị (ở chế độ Demo)
- Truy cập menu **Quản trị** hoặc đường dẫn `/#/admin`.
- Bấm nút **"👉 Điền tài khoản demo"** (`admin@hcmc.vn` / `admin123`).
- Bấm **Đăng nhập** để vào bảng điều khiển quản trị CMS!

---

## 🔥 Hướng Dẫn Kết Nối Firebase Từng Bước (Firebase Setup)

Nếu bạn muốn kết nối website vào cơ sở dữ liệu Firebase thực tế của mình:

### 1. Tạo Firebase Project
1. Truy cập [Firebase Console](https://console.firebase.google.com/) và đăng nhập tài khoản Google.
2. Bấm **Add project** (Thêm dự án), đặt tên (ví dụ: `hcmc-tourism-project`), sau đó bấm **Continue**.

### 2. Tạo Web App & Lấy Config
1. Trong màn hình tổng quan dự án, bấm vào biểu tượng Web (`</>`) để thêm ứng dụng web.
2. Đặt tên app (ví dụ: `HCMC Tourism Web`) -> Bấm **Register app**.
3. Sao chép các thông số trong `firebaseConfig`:
   ```javascript
   apiKey: "AIzaSy...",
   authDomain: "your-project.firebaseapp.com",
   projectId: "your-project",
   storageBucket: "your-project.appspot.com",
   messagingSenderId: "123456789",
   appId: "1:123456789:web:abcdef"
   ```

### 3. Tạo tệp `.env` trong dự án
Tạo tệp `.env` tại thư mục gốc của dự án (ngang hàng với `package.json`), dán thông số tương ứng:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 4. Bật Cloud Firestore
1. Trên thanh menu bên trái Firebase Console, chọn **Build** -> **Firestore Database**.
2. Bấm **Create database**, chọn vị trí máy chủ (ví dụ: `asia-southeast1` - Singapore).
3. Chọn chế độ **Production mode** và bấm **Enable**.

### 5. Cài đặt Quy Tắc Bảo Mật (Firestore Security Rules)
1. Trong tab **Rules** của Firestore, sao chép toàn bộ nội dung từ tệp [firestore.rules](file:///c:/Users/Quynh%20Nguyen/OneDrive/Desktop/hcmc/firestore.rules) trong dự án và dán vào.
2. Bấm **Publish** để áp dụng.

### 6. Bật Firebase Authentication & Tạo Tài Khoản Admin
1. Trên thanh menu bên trái, chọn **Build** -> **Authentication**.
2. Bấm **Get started** -> Chọn thẻ **Email/Password** -> Bật công tắc **Enable** ở dòng đầu tiên -> Bấm **Save**.
3. Chuyển sang tab **Users**, bấm **Add user**.
4. Nhập email và mật khẩu của bạn (ví dụ: `myadmin@gmail.com` / `matkhau123`).
5. Sau khi tạo xong, **sao chép chuỗi `User UID`** của tài khoản vừa tạo (ví dụ: `aB7xY9z...`).

### 7. Cấp Quyền Quản Trị Viên (Admin Privilege)
1. Quay lại **Firestore Database** -> tab **Data**.
2. Bấm **Start collection**, đặt tên collection là: `admins`.
3. Ở ô **Document ID**, dán chính xác chuỗi `User UID` vừa sao chép ở bước trên.
4. Thêm một trường:
   - Field: `role`, Type: `string`, Value: `admin`
5. Bấm **Save**.

### 8. Nạp Dữ Liệu Mẫu (1-Click Seed)
1. Khởi động lại ứng dụng web (`npm.cmd run dev`).
2. Vào `/#/admin` và đăng nhập bằng tài khoản email/mật khẩu bạn vừa tạo ở bước 6.
3. Ở góc trên bên phải bảng điều khiển, bấm nút **"Đồng bộ dữ liệu mẫu lên Firestore"**.
4. Toàn bộ 10 địa điểm nổi tiếng và 9 quán ăn/cà phê Quận 1 & 3 sẽ được tự động nạp vào Firestore!

---

## 📦 Hướng Dẫn Build & Triển Khai Lên Firebase Hosting

```powershell
# 1. Đóng gói mã nguồn (Tạo thư mục dist)
npm.cmd run build

# 2. Cài đặt Firebase CLI (nếu chưa có)
npm.cmd install -g firebase-tools

# 3. Đăng nhập Firebase
firebase login

# 4. Khởi tạo và liên kết dự án
firebase init hosting
# - Chọn "Use an existing project" và chọn project của bạn
# - Thư mục public directory: gõ 'dist'
# - Configure as a single-page app (rewrite all urls to /index.html)?: gõ 'y'
# - Set up automatic builds and deploys with GitHub?: gõ 'n'

# 5. Triển khai
firebase deploy --only hosting
```

---

## 📋 Danh Sách Cần Tự Bổ Sung & Xác Minh Trước Khi Xuất Bản Thực Tế

Theo đúng yêu cầu của tài liệu hướng dẫn, các thông tin sau nên được kiểm tra thực địa trước khi áp dụng thương mại:
1. **Giá vé tham quan và giờ mở cửa chính xác**: Nhà thờ Đức Bà đang đại trùng tu, giờ mở cửa có thể thay đổi theo từng giai đoạn.
2. **File Audio Guide thật**: Thay thế URL âm thanh mẫu bằng file ghi âm giọng đọc chuẩn của bạn đặt trong `public/assets/audio/` hoặc tải lên CDN.
3. **Mã QR đích đến**: Thay ảnh QR mẫu bằng mã QR dẫn đến trang audio/tài liệu chính thức của bạn.
4. **Tuyến xe buýt**: Sử dụng chức năng Google Maps tích hợp sẵn trên website để luôn có giờ xe chạy thời gian thực.
# saigondiscovery
