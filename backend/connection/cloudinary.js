import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Item from "../models/Item.js";

const router = express.Router();

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ✅ Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "campus_items",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

/* ============================
   Upload Item with Cloudinary
============================ */
router.post("/upload-item", upload.array("images", 5), async (req, res) => {
  try {
    console.log("Files received:", req.files);   // ✅ Debug log
    console.log("Body received:", req.body);     // ✅ Debug log

    const { title, price, courseSemester, location, description, category, studentId } = req.body;

    if (!title || !price || !courseSemester || !location || !category) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // ✅ Save image URLs from Cloudinary
    const imageUrls = req.files.map(file => file.path);

    const newItem = new Item({
      title,
      price,
      courseSemester,
      location,
      description,
      category,
      images: imageUrls,
      student: studentId,
      status: "pending",
    });

    await newItem.save();
    return res.json({ success: true, message: "Item uploaded for approval" });
  } catch (err) {
    console.error("Upload error:", err.message);
    return res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
