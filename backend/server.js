import express from "express";
import cors from "cors";
import connectDB from "./connection/connection.js";
import adminRoutes from "./routes/admin.js";
import studentRoutes from "./routes/student.js";
import mongoose from "mongoose";

const app = express();

// ✅ Middleware order matters
app.use(cors());
app.use(express.json()); // parse JSON correctly
app.use(express.urlencoded({ extended: true })); // parse form-urlencoded

// ✅ Routes
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Connect DB and handle index cleanup
connectDB()
  .then(() => {
    console.log("✅ MongoDB Connected");

    // 🟢 Drop duplicate index automatically
    mongoose.connection.once("open", async () => {
      try {
        console.log("🔍 Checking for duplicate indexes...");
        const Student = mongoose.connection.collection("students");
        await Student.dropIndex("rollNo_1"); // Drop duplicate index
        console.log("✅ Duplicate index rollNo_1 removed!");
      } catch (err) {
        if (err.codeName === "IndexNotFound") {
          console.log("ℹ️ No duplicate index found. All good!");
        } else {
          console.error("⚠️ Error removing index:", err.message);
        }
      }
    });
  })
  .catch((err) => console.error("❌ DB connection error:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
