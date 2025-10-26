import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  collegeId: "",   // this is probably rollNo
  semester: "",
  password: "",
});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/student/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Signup successful!");
        navigate("/student-login");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="container mt-5 col-md-6" style={{ maxWidth: '400px', background: 'white' }}>
    
      <h2 className="mb-4 text-center">Student Signup</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input className="form-control mb-2" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input className="form-control mb-2" name="collegeId" placeholder="College ID" value={formData.collegeId} onChange={handleChange} required />
        <input className="form-control mb-2" type="number" name="semester" placeholder="Semester" value={formData.semester} onChange={handleChange} required />
        <input className="form-control mb-3" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit" className="btn btn-primary w-100" onClick={() => navigate('/student-panel')} style={{ margin: '16px 0' }}>Sign Up</button>
      </form>
    </div>
  );
};
export default StudentSignup;