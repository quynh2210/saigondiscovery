const path = require('path');
const dotenv = require('dotenv');

// Nạp biến môi trường từ server/.env và dự phòng từ root .env
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const express = require('express');
const cors = require('cors');

const uploadRoute = require('./upload');

const app = express();

// Cho phép mọi origin (Vite port 5173, Live Server port 5500, v.v.)
app.use(cors());
app.use(express.json());

// Log mỗi request để debug
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Route upload ảnh lên Cloudinary
app.use('/upload', uploadRoute);

app.get('/', (req, res) => {
  res.json({ status: 'Upload server running', port: 3000 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Upload server chạy tại http://localhost:${PORT}`);
  console.log(`   POST http://localhost:${PORT}/upload  (field: "image")`);
});
