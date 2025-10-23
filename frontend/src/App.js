import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Your landing page
import AdminSignup from './components/AdminSignup';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import StudentLogin from './components/StudentLogin';
import StudentSignup from './components/StudentSignup';
import StudentPanel from './components/StudentPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbar/>} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-signup" element={<StudentSignup />} />
        <Route path="/student-panel" element={<StudentPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
