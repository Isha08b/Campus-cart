// models/Listing.js
const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: String,
  category: String,
  semester: Number,
  location: String,
  image: String,   // ✅ rename to `image` (to match Cloudinary code)
  student: {
    name: String,
    email: String,
    id: String
  },
}, { timestamps: true });

module.exports = mongoose.model("Listing", listingSchema);
