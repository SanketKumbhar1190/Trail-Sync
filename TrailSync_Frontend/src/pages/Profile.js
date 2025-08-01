import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig"; // API instance

const Profile = () => {
  const [userData, setUserData] = useState({
    email: "",
    role: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [editingEmail, setEditingEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username) {
      setUserData({
        email: user.username,
        role: user.roleName,
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleEmailChange = (e) => {
    setUserData({ ...userData, email: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Update Email
  const updateEmail = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("user"))?.jwtToken;
      const response = await api.put(
        "/auth/user/update-email",
        { email: userData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Email updated successfully!");
      localStorage.setItem("user", JSON.stringify({ ...userData, jwtToken: token }));
      setEditingEmail(false);
    } catch (error) {
      alert("Failed to update email.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Update Password
  const updatePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem("user"))?.jwtToken;
      await api.put(
        "/auth/user/update-password",
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      alert("Failed to update password.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Profile ({userData.role})</h2>

      {/* User Info Section */}
      <div className="card p-4 shadow mt-4">
        <h4>User Information</h4>
        <div className="d-flex align-items-center">
          <input
            type="email"
            className="form-control me-2"
            value={userData.email}
            onChange={handleEmailChange}
            disabled={!editingEmail}
          />
          <button className="btn btn-warning" onClick={() => setEditingEmail(!editingEmail)}>
            {editingEmail ? "Save" : "Edit"}
          </button>
        </div>
        {editingEmail && (
          <button className="btn btn-primary mt-2" onClick={updateEmail} disabled={loading}>
            Update Email
          </button>
        )}
      </div>

      {/* Reset Password Section */}
      <div className="card p-4 shadow mt-4">
        <h4>Reset Password</h4>
        <div className="mb-3">
          <label className="form-label">Current Password</label>
          <input
            type="password"
            className="form-control"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Re-enter New Password</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <button className="btn btn-danger" onClick={updatePassword} disabled={loading}>
          Update Password
        </button>
      </div>
    </div>
  );
};

export default Profile;
