import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    role: { id: 1 }, //  Default role is User (id: 1)
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("users/register", user);
      console.log("User registered:", response.data);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to register. Try again!");
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-4 offset-md-4">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label>Username</label>
            <input type="text" name="username" className="form-control" value={user.username} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" name="email" className="form-control" value={user.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" name="password" className="form-control" value={user.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-success w-100">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
