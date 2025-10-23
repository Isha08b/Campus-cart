import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  uniqueId: { type: String }  // Store admin unique code if needed
}, { timestamps: true });

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
