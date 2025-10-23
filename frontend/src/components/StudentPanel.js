import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/student";

function StudentPanel() {
  const storedStudent = JSON.parse(localStorage.getItem("student") || "{}");
  const studentId = storedStudent.id || "";

  const [filters, setFilters] = useState({
    category: [],
    courseSemester: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    courseSemester: "",
    location: "",
    description: "",
    category: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [message, setMessage] = useState("");
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  // Fetch approved items
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/items`, { params: filters });
      setItems(res.data || []);
      setMessage("");
    } catch (err) {
      console.error("Error fetching items:", err);
      setMessage("❌ Error loading items");
    }
  };

  // Fetch my items for notifications
  const fetchNotifications = async () => {
    if (!studentId) return setNotifications([]);
    try {
      const res = await axios.get(`${API_URL}/my-items/${studentId}`);
      const notes = (res.data || [])
        .filter((it) => it.status && it.status !== "pending")
        .map((it) => ({ _id: it._id, title: it.title, status: it.status }));
      setNotifications(notes);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchNotifications();
  }, [filters]);

  // Filter handlers
  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "category") {
      setFilters((prev) => {
        const updated = checked
          ? [...prev.category, value]
          : prev.category.filter((c) => c !== value);
        return { ...prev, category: updated };
      });
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmitFilters = (e) => {
    e.preventDefault();
    fetchItems(filters);
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || "" : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleAddToCart = (item) =>
    setCart((prev) => {
      if (prev.some((cartItem) => cartItem._id === item._id)) {
        return prev;
      }
      return [...prev, item];
    });

  const handleBuyItem = (item) => {
    alert(
      `To buy the item, contact the seller at: ${item.student.email}\nItem Price: ₹${item.price}\nLocation: ${item.location}`
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "title",
      "price",
      "courseSemester",
      "location",
      "category",
    ];
    for (const f of requiredFields) {
      if (!formData[f] || formData[f].toString().trim() === "") {
        setMessage(`❌ Please fill required field: ${f}`);
        return;
      }
    }
    if (images.length === 0) {
      setMessage("❌ Please upload at least one image");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((k) => data.append(k, formData[k]));
    images.forEach((file) => data.append("images", file));
    data.append("studentId", studentId);

    try {
      const res = await axios.post(`${API_URL}/upload-item`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message || " Item uploaded successfully!");
      setFormData({
        title: "",
        price: "",
        courseSemester: "",
        location: "",
        description: "",
        category: "",
      });
      setImages([]);
      setImagePreviews([]);
      setFileInputKey(Date.now()); // Reset key to clear file input
      fetchItems();
      fetchNotifications();
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage(
        err.response?.data?.message || "❌ Upload failed. Please try again."
      );
    }
  };

  return (
    <div id="student-panel" className="container mt-4">
      <div className="navbar mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' , backgroundColor: '#f8f9fa', padding: '10px 20px', borderRadius: '8px'}}>
        <h2>Student Panel</h2>
        <div>Logged in as: <strong>{storedStudent.name || "Guest"}</strong></div>
        <div className="d-flex gap-2">
          {/* <button
            type="button"
            className="btn btn-primary"
            onClick={handleLogout}
          >
            Logout
          </button> */}
        </div>
        
      </div>

      <div className="row mb-4">
        {/* Filters Section (left, smaller) */}
        <div className="col-md-3">
          <h5>Filter Items</h5>
          <form className="border p-3 rounded bg-light">
            <div className="mb-3">
              <label className="form-label fw-bold">Category</label>
              {[
                "Laptops",
                "Books & Stationery",
                "Electronics",
                "Other",
              ].map((cat) => (
                <div className="form-check" key={cat}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="category"
                    value={cat}
                    onChange={handleFilterChange}
                    checked={filters.category.includes(cat)}
                  />
                  <label className="form-check-label">{cat}</label>
                </div>
              ))}
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Course & Semester</label>
              <select
                className="form-select"
                name="courseSemester"
                value={filters.courseSemester}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="B.Tech CSE - 1 Sem">B.Tech CSE - 1 Sem</option>
                <option value="B.Tech CSE - 2 Sem">B.Tech CSE - 2 Sem</option>
                <option value="B.Tech CSE - 3 Sem">B.Tech CSE - 3 Sem</option>
                <option value="B.Tech CSE - 4 Sem">B.Tech CSE - 4 Sem</option>  
                <option value="B.Tech CSE - 5 Sem">B.Tech CSE - 5 Sem</option>
                <option value="B.Tech CSE - 6 Sem">B.Tech CSE - 6 Sem</option>
                <option value="B.Tech CSE - 7 Sem">B.Tech CSE - 7 Sem</option>
                <option value="B.Tech CSE - 8 Sem">B.Tech CSE - 8 Sem</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Price Range (₹)</label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control"
                  name="minPrice"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
                <input
                  type="number"
                  className="form-control"
                  name="maxPrice"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Location</label>
              <input
                type="text"
                className="form-control"
                name="location"
                placeholder="e.g. Hostel A"
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>
            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={handleSubmitFilters}
            >
              Apply Filters
            </button>
          </form>
        </div>

        {/* Available Items List (right, larger) */}
        <div className="col-md-9">
          <h4>Available Items</h4>
          <div className="row">
            {items.length > 0 ? (
              items.map((item) => (
                <div className="col-md-6 mb-4" key={item._id}>
                  <div className="card">
                    <img
                      src={
                        item.images?.[0] ||
                        item.image ||
                        "https://via.placeholder.com/300"
                      }
                      className="card-img-top"
                      alt={item.title}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">
                        Price: ₹{item.price}
                        <br />
                        Description: {item.description || "N/A"}
                        <br />
                        Location: {item.location}
                      </p>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleBuyItem(item)}
                      >
                        Buy Item
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No items found.</p>
            )}
          </div>
        </div>
     </div>

      <hr className="my-5" />

      {/* Post Item Section (below filters & items) */}
      <div className="mt-5">
        <h4>Post Your Item</h4>
        {message && <div className="alert alert-info">{message}</div>}
        <form
          onSubmit={handleSubmit}
          className="border p-4 rounded shadow-sm bg-light"
        >
          <div className="row">
            {["title", "price", "courseSemester", "location"].map((field) => (
              <div className="col-md-6 mb-3" key={field}>
                <input
                  type={field === "price" ? "number" : "text"}
                  className="form-control"
                  name={field}
                  placeholder={
                    field.charAt(0).toUpperCase() + field.slice(1)
                  }
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <div className="col-md-6 mb-3">
              <select
                className="form-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Laptops">Laptops</option>
                <option value="Books & Stationery">Books & Stationery</option>
                <option value="Electronics">Electronic Items</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-md-12 mb-3">
              <textarea
                className="form-control"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="col-md-12 mb-3">
              <input
                key={fileInputKey}
                type="file"
                className="form-control"
                onChange={handleFileChange}
                accept="image/*"
                multiple
                required
              />
            </div>
            {imagePreviews.length > 0 && (
              <div className="col-md-12 mb-3">
                <img
                  src={imagePreviews[0]}
                  alt="Main"
                  className="img-fluid mb-2"
                  style={{ maxHeight: "200px" }}
                />
                <div className="d-flex flex-wrap gap-2">
                  {imagePreviews.slice(1).map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Preview ${idx}`}
                      className="img-thumbnail"
                      style={{ height: "60px", width: "60px" }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="col-md-12">
              <button type="submit" className="btn btn-primary">
                Submit for Approval
              </button>
            </div>
          </div>
        </form>
      </div>

      <hr className="my-5" />

      {/* Notifications & Cart Section (side-by-side) */}
      <div className="row mt-5">
        {/* Notifications */}
        <div className="col-md-6">
          <h4>Notifications</h4>
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`alert ${
                  n.status === "approved" ? "alert-success" : "alert-danger"
                }`}
              >
                {n.title} — {n.status.toUpperCase()}
              </div>
            ))
          ) : (
            <p>No notifications.</p>
          )}
        </div>

        {/* Cart */}
        <div className="col-md-6">
          <h4>My Cart</h4>
          {cart.length > 0 ? (
            cart.map((item, i) => (
              <div
                key={i}
                className="alert alert-info d-flex align-items-center"
              >
                <img
                  src={
                    item.images?.[0] ||
                    item.image ||
                    "https://via.placeholder.com/50"
                  }
                  alt={item.title}
                  style={{
                    height: "50px",
                    width: "50px",
                    objectFit: "cover",
                  }}
                  className="me-3"
                />
                <div>
                  <strong>{item.title}</strong> - ₹{item.price}
                </div>
              </div>
            ))
          ) : (
            <p>No items in cart.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentPanel;