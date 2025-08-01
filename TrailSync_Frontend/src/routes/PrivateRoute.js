import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ role }) => {
  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Debugging: Check the structure of user data
  console.log("User data from localStorage:", user);

  // If user is not logged in or does not have a JWT token
  if (!user || !user.jwtToken) {
    console.log("User is not logged in or missing JWT token");
    return <Navigate to="/login" />;
  }

  // If the role is specified and does not match the user's role
  if (role && user.roleName !== role) {
    console.log(`User role (${user.role}) does not match the required role (${role})`);
    return <Navigate to="/" />;
  }

  // If everything checks out, render the outlet (child routes)
  return <Outlet />;
};

export default PrivateRoute;
