import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  courseSemester: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  images: [String], // multiple image URLs
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  status: { type: String, default: "pending" } // pending → approved/denied
}, { timestamps: true });

export default mongoose.model("Item", itemSchema);
