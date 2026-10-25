const express = require('express');
const router = express.Router();
const upload = require('./middleware/multer');
const cloudinary = require('./utils/cloudinary');

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      console.warn("Upload request received but no file was provided.");
      return res.status(400).json({ error: "No file provided in field 'image'" });
    }
    console.log("File received:", req.file.originalname, "size:", req.file.size);

    // Wrap upload_stream in a Promise with 25s timeout
    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "covers", resource_type: "auto" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload_stream error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload successful:", result.secure_url);
            resolve(result);
          }
        }
      );
      stream.end(req.file.buffer);
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Cloudinary upload timed out after 25s")), 25000)
    );

    const result = await Promise.race([uploadPromise, timeoutPromise]);

    res.json({ imageUrl: result.secure_url, url: result.secure_url });

  } catch (err) {
    console.error("Upload route error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
