import React, { useState } from "react";
import axios from "axios";

const PostItemForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    semester: "",
    location: "",
    price: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle text input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file select
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setMessage("❌ Please upload an image");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    data.append("image", image);

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(
        "http://localhost:5000/api/student/upload-item", // 👈 backend route
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage(res.data.message || "  Item uploaded successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        semester: "",
        location: "",
        price: "",
      });
      setImage(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">📌 Post a New Item</h3>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
        
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Laptops">💻 Laptops</option>
              <option value="Books">📚 Books & Stationery</option>
              <option value="Electronics">🔌 Electronics</option>
              <option value="Other">📦 Other</option>
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">Semester</label>
            <input
              type="number"
              className="form-control"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="text"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            accept="image/*"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Uploading..." : "Post Item"}
        </button>
      </form>
    </div>
  );
};

export default PostItemForm;