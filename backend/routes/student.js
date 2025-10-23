// backend/routes/student.js
import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import Student from "../models/Student.js";
import Item from "../models/Item.js";

const router = express.Router();

/* -----------------------
   Cloudinary + Multer
   ----------------------- */
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Cloudinary storage (declare BEFORE using `upload`)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "campus_items",
    allowed_formats: ["jpg", "png", "jpeg"],
    // optional: transformation: [{ width: 1200, crop: "limit" }],
  },
});

const upload = multer({ storage });

router.post("/signup", async (req, res) => {
  try {
    const { name, email, collegeId, semester, password } = req.body;

    // Validation
    if (!name || !email || !collegeId || !semester || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check duplicate email
    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check duplicate collegeId
    const existingCollegeId = await Student.findOne({ collegeId });
    if (existingCollegeId) {
      return res.status(400).json({ message: "College ID already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student
    const student = new Student({
      name,
      email,
      collegeId,
      semester,
      password: hashedPassword
    });

    await student.save();
    return res.status(201).json({ success: true, message: "Signup successful!" });

  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ message: "Server error, please try again later" });
  }
});

/* =========================
   Login (kept same format)
   ========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email & password required" });

    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // return the same structure your frontend expects
    return res.json({ success: true, student });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   Upload Item (multiple images -> Cloudinary)
   ========================= */
router.post("/upload-item", upload.array("images", 5), async (req, res) => {
  try {
    // body fields (strings). price comes as string from form.
    const { title, price, courseSemester, location, description, category, studentId } = req.body;

    if (!title || !price || !courseSemester || !location || !category) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image" });
    }

    // Cloudinary returns `path` for each stored file (CloudinaryStorage)
    const imageUrls = req.files.map((f) => f.path);

    const newItem = new Item({
      title,
      price: Number(price) || 0,
      courseSemester,
      location,
      description,
      category,
      images: imageUrls,
      student: studentId || null,
      status: "pending",
    });

    await newItem.save();
    return res.json({ success: true, message: "Item uploaded for approval" });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

/* =========================
   Get approved items (filters)
   ========================= */
router.get("/items", async (req, res) => {
  try {
    const { category, courseSemester, location, minPrice, maxPrice } = req.query;
    const filter = { status: "approved" };

    if (category) {
      // if category is sent as multiple params, req.query.category may be array
      filter.category = Array.isArray(category) ? { $in: category } : category;
    }
    if (courseSemester) filter.courseSemester = courseSemester;
    if (location) filter.location = { $regex: location, $options: "i" };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice, 10);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice, 10);
    }

    const items = await Item.find(filter).populate("student", "name email");
    return res.json(items);
  } catch (err) {
    console.error("Fetch items error:", err);
    return res.status(500).json({ message: "Error fetching items" });
  }
});

/* =========================
   Get my items (for notifications / status)
   ========================= */
router.get("/my-items/:studentId", async (req, res) => {
  try {
    const myItems = await Item.find({ student: req.params.studentId });
    return res.json(myItems);
  } catch (err) {
    console.error("My items fetch error:", err);
    return res.status(500).json({ message: "Error fetching my items" });
  }
});

export default router;
