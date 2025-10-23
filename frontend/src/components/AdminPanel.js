import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/admin";

const AdminPanel = () => {
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState(["Laptops", "Books", "Electronics", "Other"]);
  const [newCategory, setNewCategory] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [adminProfile, setAdminProfile] = useState({ name: "", email: "", password: "" }); // Initial state for admin profile
  const navigate = useNavigate();

  //   Fetch data on component mount
  useEffect(() => {
    fetchPendingItems();
    fetchStudents();
    fetchAdminProfile();
  }, []);

  //   Fetch pending items
  const fetchPendingItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/pending-items`);
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  //   Fetch registered students
  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/students`);
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  //   Fetch admin's own profile information
  const fetchAdminProfile = async () => {
    try {
      // Assuming admin ID is stored after login
      const adminId = localStorage.getItem("adminId");
      if (adminId) {
        const res = await axios.get(`${API_URL}/profile/${adminId}`);
        setAdminProfile(res.data);
      }
    } catch (err) {
      console.error("Error fetching admin profile:", err);
    }
  };

  //   Handle admin profile updates
  const handleEditProfile = async () => {
    try {
      const adminId = localStorage.getItem("adminId");
      await axios.put(`${API_URL}/profile/edit/${adminId}`, adminProfile);
      alert("Profile updated successfully!");
      setShowProfile(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  //   Approve/Deny/Delete item
  const handleApproval = async (id, action) => {
    try {
      const endpoint = `${API_URL}/${action}/${id}`;
      await axios.put(endpoint);
      fetchPendingItems();
    } catch (err) {
      console.error(`Error ${action} item:`, err);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const endpoint = `${API_URL}/delete-item/${id}`;
      await axios.delete(endpoint);
      fetchPendingItems();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  //   Add new category
  const handleAddCategory = () => {
    if (newCategory.trim() !== "" && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };
  
  //   Delete category from state
  const handleDeleteCategory = (cat) => {
    setCategories(categories.filter(c => c !== cat));
  };
  
  //   Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminId");
    navigate("/"); // Navigate to the homepage
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#fff", color: "#000" }}>
      {/* Navbar with new buttons */}
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#add8e6" }}>
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="/">Admin Dashboard</a>
          <div className="d-flex">
            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
            <button className="btn btn-outline-primary ms-2" onClick={() => setShowProfile(true)}>Profile</button>
            <button className="btn btn-outline-secondary ms-2">Settings</button>
          </div>
        </div>
      </nav>

      {/* Admin Profile Section */}
      {showProfile && (
        <div className="container my-4">
          <div className="card mx-auto" style={{ maxWidth: "500px" }}>
            <div className="card-header bg-primary text-white">
              Admin Profile
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={adminProfile.name}
                  onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={adminProfile.email}
                  onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={adminProfile.password}
                  onChange={(e) => setAdminProfile({ ...adminProfile, password: e.target.value })}
                />
              </div>
              <div className="d-flex justify-content-between">
                <button className="btn btn-success" onClick={handleEditProfile}>Save Changes</button>
                <button className="btn btn-outline-danger" onClick={handleLogout}>Sign Out</button>
                <button className="btn btn-secondary" onClick={() => setShowProfile(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Sections (hidden when profile is shown) */}
      {!showProfile && (
        <>
          <div className="container my-4">
            <div className="row">
              <div className="col-md-6 mb-4">
                <h4 className="mb-3">Pending Listings</h4>
                <div className="row">
                  {requests.length > 0 ? requests.map((req) => (
                    <div className="col-12 mb-4" key={req._id}>
                      <div className="card">
                        <img src={req.image || "https://via.placeholder.com/300"} className="card-img-top" alt="product" />
                        <div className="card-body">
                          <h5>{req.title}</h5>
                          <p>{req.description}</p>
                          <p><b>Price:</b> {req.price}</p>
                          <p><b>Student:</b> {req.student?.name || "N/A"} | {req.student?.course || "N/A"}</p>
                          <p><b>Location:</b> {req.location} | <b>Category:</b> {req.category}</p>
                          <div className="d-flex gap-2">
                            <button className="btn btn-success btn-sm" onClick={() => handleApproval(req._id, "approve")}>Approve</button>
                            <button className="btn btn-warning btn-sm" onClick={() => handleApproval(req._id, "deny")}>Deny</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(req._id)}>Delete</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : <p>No pending items</p>}
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <h4>Registered Students</h4>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>No. of Listings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => (
                        <tr key={s._id}>
                          <td>{s.name}</td>
                          <td>{s.email}</td>
                          <td>{s.course}</td>
                          <td>{s.listingsCount || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="container my-4">
            <h4 className="mb-3">Manage Categories</h4>
            <div className="row">
              <div className="col-md-6">
                <ul className="list-group">
                  {categories.map((cat, idx) => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={idx}>
                      {cat}
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCategory(cat)}>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-6">
                <div className="mt-3 mt-md-0 d-flex gap-2">
                  <input 
                    className="form-control" 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)} 
                    placeholder="New Category" 
                  />
                  <button className="btn btn-success" onClick={handleAddCategory}>Add</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;