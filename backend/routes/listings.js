const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../connection/cloudinary");
const Listing = require("../models/Listing");

// Multer setup (to handle file before sending to Cloudinary)
const storage = multer.diskStorage({});
const upload = multer({ storage });

// POST new listing with image
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const newListing = new Listing({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      semester: req.body.semester,
      location: req.body.location,
      imageUrl: result.secure_url,
      student: req.body.student, // pass studentId or details
    });

    await newListing.save();
    res.status(201).json({ message: "Listing created", listing: newListing });
  } catch (err) {
    console.error("Error uploading:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET listings with filters
router.get("/", async (req, res) => {
  try {
    const { category, semester, location } = req.query;
    const filters = {};
    if (category) filters.category = category;
    if (semester) filters.semester = semester;
    if (location) filters.location = location;

    const listings = await Listing.find(filters);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
