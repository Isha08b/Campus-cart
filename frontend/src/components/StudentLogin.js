// src/components/StudentLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/student/login", formData);

      if (res.data.success) {
        //  Save student info to localStorage
        localStorage.setItem(
          "student",
          JSON.stringify({ id: res.data.student._id, name: res.data.student.name })
        );
        alert("Login successful!");
        navigate("/student-panel");
      } else {
        setError("Login failed!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container mt-5 col-md-6" id="student-login">
      <h2 className="mb-4 text-center">Student Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-3"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-success w-100">Login</button>
      </form>
    </div>
  );
};

export default StudentLogin;
