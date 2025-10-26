import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// The Admin API URL
const API_URL = "http://localhost:5000/api/admin";
// The shared Category API URL (Mocked for now, assume this is a shared endpoint)
const CATEGORY_API_URL = "http://localhost:5000/api/categories"; 

// Mock function to simulate fetching/updating categories from a shared source
// REPLACE WITH REAL AXIOS CALLS TO YOUR CATEGORY API
const mockCategoryStorage = {
    categories: ["Laptops", "Books & Stationery", "Electronics", "Other"],
    fetch: () => Promise.resolve(mockCategoryStorage.categories),
    add: (newCat) => {
        if (!mockCategoryStorage.categories.includes(newCat)) {
            mockCategoryStorage.categories.push(newCat);
        }
        return Promise.resolve(mockCategoryStorage.categories);
    },
    delete: (cat) => {
        mockCategoryStorage.categories = mockCategoryStorage.categories.filter(c => c !== cat);
        return Promise.resolve(mockCategoryStorage.categories);
    }
};

const AdminPanel = () => {
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);
  // ⭐ CHANGE: Initial state now comes from a function call
  const [categories, setCategories] = useState([]); 
  const [newCategory, setNewCategory] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [adminProfile, setAdminProfile] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  // ⭐ NEW: Fetch categories
  const fetchCategories = async () => {
    try {
        // ⭐ ACTION: Replace mockCategoryStorage.fetch with: await axios.get(CATEGORY_API_URL);
        const fetchedCategories = await mockCategoryStorage.fetch(); 
        setCategories(fetchedCategories);
    } catch (err) {
        console.error("Error fetching categories:", err);
    }
  }

  // ✅ Fetch data on component mount
  useEffect(() => {
    fetchPendingItems();
    // fetchStudents();
    fetchAdminProfile();
    fetchCategories(); // ⭐ NEW: Fetch categories on load
  }, []);

  // ✅ Fetch pending items
  // (No change)
  const fetchPendingItems = async () => {
    try {
      // NOTE: Ensure your backend endpoint returns the Student object along with the item
      const res = await axios.get(`${API_URL}/pending-items`);
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const API_URL = 'http://localhost:5000/api/admin'; 

// This array contains existing student IDs and the fields to update
const updates = [
    // Note: The _id is crucial for the backend to know which document to update
    { _id: '60c728e21a24d52e5d93e150', course: 'B.Tech CSE - 6 Sem' },
    { _id: '60c728e21a24d52e5d93e151', listingsCount: 5 },
    { _id: '60c728e21a24d52e5d93e152', isGraduated: true, course: 'Alumni' },
];

const updateMultipleStudents = async () => {
    try {
        const token = localStorage.getItem("adminToken"); 

        const res = await axios.put(`${API_URL}/students/bulk`, 
            // 1. Send the array of update objects
            updates, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("Successfully updated students:", res.data);
        alert(`Successfully updated ${res.data.modifiedCount} student records!`);

    } catch (err) {
        console.error("Error during bulk update:", err.response ? err.response.data : err.message);
        alert("Failed to update students.");
    }
};

// You would call this function when the Admin updates a list.
// updateMultipleStudents();
 

  // ✅ Fetch admin's own profile information (No change)
  const fetchAdminProfile = async () => { /* ... */ };

  // ✅ Handle admin profile updates (No change)
  const handleEditProfile = async () => { /* ... */ };

  // ✅ Approve/Deny/Delete item (No change)
  const handleApproval = async (id, action) => { /* ... */ };
  const handleDeleteItem = async (id) => { /* ... */ };

  // ⭐ UPDATED: Add new category (now uses mock storage/API call)
  const handleAddCategory = async () => {
    if (newCategory.trim() !== "" && !categories.includes(newCategory.trim())) {
      try {
        // ⭐ ACTION: Replace mockCategoryStorage.add with: await axios.post(CATEGORY_API_URL, { name: newCategory.trim() });
        const updatedCategories = await mockCategoryStorage.add(newCategory.trim());
        setCategories(updatedCategories);
        setNewCategory("");
      } catch (err) {
        console.error("Error adding category:", err);
      }
    }
  };
  
  // ⭐ UPDATED: Delete category from state (now uses mock storage/API call)
  const handleDeleteCategory = async (cat) => {
    try {
        // ⭐ ACTION: Replace mockCategoryStorage.delete with: await axios.delete(`${CATEGORY_API_URL}/${cat}`);
        const updatedCategories = await mockCategoryStorage.delete(cat);
        setCategories(updatedCategories);
    } catch (err) {
        console.error("Error deleting category:", err);
    }
  };
  
  // ✅ Handle logout (No change)
  const handleLogout = () => { /* ... */ };

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
            {/* ... (Admin Profile UI - No changes) ... */}
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
                        {/* ⭐ IMPORTANT: Ensure your backend returns the student details (req.student) and correct image path */}
                        <img src={req.image || "https://via.placeholder.com/300"} className="card-img-top" alt="product" />
                        <div className="card-body">
                          <h5>{req.title}</h5>
                          <p>{req.description}</p>
                          <p><b>Price:</b> {req.price}</p>
                          {/* ⭐ STUDENT INFO: Displaying student name and course/semester */}
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
                <h4 className="mb-3">Registered Students</h4>
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
                      {/* ⭐ STUDENT INFO: Students list shown here */}
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
                  {/* ⭐ CATEGORIES: Displaying dynamic categories */}
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