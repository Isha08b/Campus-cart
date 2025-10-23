import express from "express";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import Item from "../models/Item.js";  // ✅ Import Item model to update status

const router = express.Router();

// ✅ Admin Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password, uniqueAdminID } = req.body;

    if (uniqueAdminID !== process.env.ADMIN_UNIQUE_ID) {
      return res.status(401).json({ message: "Invalid Admin ID" });
    }

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(409).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const admin = new Admin({ name, email, phone, password: hashed, uniqueAdminID });
    await admin.save();

    res.status(201).json({ success: true, message: "Admin registered successfully" });
  } catch (err) {
    console.error("Admin signup error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ success: true, message: "Login successful" });
  } catch (err) {
    console.error("Admin login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Approve Item
router.put("/approve/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ success: true, message: "Item approved", item });
  } catch (err) {
    console.error("Approve error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Deny Item
router.put("/deny/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status: "denied" },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ success: true, message: "Item denied", item });
  } catch (err) {
    console.error("Deny error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
