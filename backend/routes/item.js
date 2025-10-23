router.post("/upload-item", upload.array("images", 5), async (req, res) => {
  try {
    const { title, price, courseSemester, location, description, category, studentId } = req.body;

    if (!title || !price || !courseSemester || !location || !category) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // ✅ Validate req.files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    // ✅ Upload images to Cloudinary
    const cloudinary = require("cloudinary").v2;
    const uploadPromises = req.files.map(file =>
      cloudinary.uploader.upload_stream({ folder: "items" }, (error, result) => {
        if (error) throw new Error(error);
        return result.secure_url;
      })
    );

    const imageUrls = await Promise.all(uploadPromises);

    // ✅ Save item in MongoDB
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
