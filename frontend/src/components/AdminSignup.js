import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    uniqueAdminID: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Admin signup successful!');
        navigate('/admin-login');  // redirect after success
      } else {
        alert(data.message || 'Signup failed');
      }

    } catch (err) {
      console.error('Signup error:', err.message);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container mt-5 col-md-6" style={{ maxWidth: '400px', background: 'white' }}>
      <h2 className="mb-4 text-center">Admin Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="uniqueAdminID" className="form-label">Unique Admin ID</label>
          <input
            type="text"
            className="form-control"
            id="uniqueAdminID"
            name="uniqueAdminID"
            value={formData.uniqueAdminID}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" style={{ margin: '16px 0' }}>Sign Up</button>
      </form>
    </div>
  );
};

export default AdminSignup;
