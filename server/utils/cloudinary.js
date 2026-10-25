const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from server/.env first, then root .env as fallback
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // default cwd fallback

const cloudinary = require('cloudinary').v2;

const cloudName = process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_KEY || process.env.API_KEY;
const apiSecret = process.env.CLOUDINARY_SECRET_KEY || process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET || process.env.API_SECRET;

console.log("Cloudinary Config Status:", {
  cloud_name: cloudName || "MISSING",
  api_key: apiKey ? "Configured (" + apiKey.slice(0, 4) + "..." + apiKey.slice(-3) + ")" : "MISSING",
  api_secret: apiSecret ? "Configured" : "MISSING"
});

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
});

module.exports = cloudinary;
