import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSlash, faTrash, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminManageUsers.css"; // Add custom styles

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("user"));
  const token = admin?.jwtToken;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  const suspendUser = async (userId) => {
    try {
      await api.put(`/users/suspend/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.map(user => user.id === userId ? { ...user, status: "Suspended" } : user));
      alert("User suspended successfully!");
    } catch (error) {
      console.error("Error suspending user", error);
    }
  };

  const removeUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter(user => user.id !== userId));
      alert("User removed successfully!");
    } catch (error) {
      console.error("Error removing user", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Manage Users</h2>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>
                    {/* {user.status !== "Suspended" && (
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => suspendUser(user.id)}
                      >
                        <FontAwesomeIcon icon={faUserSlash} className="me-1" /> Suspend
                      </button>
                    )} */}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeUser(user.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} className="me-1" /> Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button className="btn btn-secondary mt-3" onClick={() => navigate("/admin-dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default ManageUsers;
