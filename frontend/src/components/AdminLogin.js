import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',  //   use password, not uniqueId
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', formData);
      
      if (response.status === 200) {   //   check status, backend returns message only
        alert('Login Successful');
        navigate('/admin-panel');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px', background: 'white' }}>
      <h2 className="mb-4">Admin Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
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

        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
