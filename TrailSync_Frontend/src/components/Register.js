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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!user.username || user.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }
    if (!user.email || !emailRegex.test(user.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!user.password || user.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (user.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    try {
      const response = await api.post("users/register", user);
      console.log("User registered:", response.data);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error);
      const fieldErrors = error.response?.data?.errors;
      if (fieldErrors) {
        setErrors(fieldErrors);
      } else {
        alert(error.response?.data?.message || "Failed to register. Try again!");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-4 offset-md-4">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label>Username</label>
            <input
              type="text"
              name="username"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              value={user.username}
              onChange={handleChange}
              required
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={user.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={user.password}
              onChange={handleChange}
              required
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>
          <button type="submit" className="btn btn-success w-100">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
