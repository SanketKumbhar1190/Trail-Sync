import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Profile Icon from react-icons

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Retrieve user data from localStorage

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user from localStorage on logout
    navigate("/login"); // Redirect to login page after logout
  };

  console.log(user);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">
        <img src="img/logo.png" className="img-fluid" alt="Logo" />
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about">About</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/events">All Events</Link>
          </li>
        </ul>

        {user ? (
          <div className="d-flex align-items-center">
            <div className="dropdown">
              <button
                className="btn btn-dark dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                }}
              >
                <FaUserCircle size={24} style={{ color: "white" }} />
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                {/* Profile Button for User and Admin */}
                <li>
                  <Link className="dropdown-item" to="/profile">Profile</Link>
                </li>

                {/* Show User Dashboard for User */}
                {user.roleName === "ROLE_USER" && (
                  <li>
                    <Link className="dropdown-item" to="/user-dashboard">User Dashboard</Link>
                  </li>
                )}

                {/* Show Admin Dashboard for Admin */}
                {user.roleName === "ROLE_ADMIN" && (
                  <li>
                    <Link className="dropdown-item" to="/admin-dashboard">Admin Dashboard</Link>
                  </li>
                )}

                {/* Common: Logout Option */}
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Link className="btn btn-outline-light" to="/login">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
