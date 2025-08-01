import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Login from "../components/Login";
import Register from "../components/Register";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard";

import CreateEvent from "../pages/CreateEvent";
import EventDetails from "../pages/EventDetails";
import PrivateRoute from "./PrivateRoute";
import MyEventsPage from "../pages/MyEventsPage";
import ManageEvent from "../pages/admin/ManageEvent";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageLocations from "../pages/admin/ManageLocations";
import AnalyticsReports from "../pages/admin/AnalyticsReports";
import AdminPayments from "../pages/admin/AdminPayments";


import ViewParticipantsPage from "../pages/ViewParticipantsPage";

import InvoicePage from "../pages/InvoicePage"; // Import the invoice page
import EnrolledEvents from "../pages/EnrolledEvents"; // ✅ Import new page


import UpdateEventPage from "../pages/UpdateEventPage";
import AllEventsPage from "../pages/AllEventsPage"; // Import All Events page
import Home from "../pages/Home"; // Import Home page
import AddExpense from "../pages/AddExpense";
import UpdateExpensePage from "../pages/UpdateExpensePage"; // New page for expense update
import PaymentPage from "../pages/PaymentPage";
import AboutPage from "../pages/About";
import SearchEventByLocation from "../pages/SearchEventByLocation";
import Profile from "../pages/Profile";

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Set Home route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<AllEventsPage />} /> {/* Route for All Events */}
        <Route path="/search-events" element={<SearchEventByLocation />} />
        <Route path="/about/" element={<AboutPage />} />
        <Route path="/event-participants/:eventId" element={<ViewParticipantsPage />} />


        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/my-events" element={<MyEventsPage />} />
          <Route path="/enrolled-events" element={<EnrolledEvents />} /> {/* ✅ New Route */}


          

          {/* Protected profile and dashboard */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/invoice/:id" element={<InvoicePage />} />
          
          <Route path="/add-expense/:eventId" element={<AddExpense />} />
          <Route path="/update-event/:id" element={<UpdateEventPage />} />
          <Route path="/update-expense/:id" element={<UpdateExpensePage />} />
          <Route path="/payment/:id" element={<PaymentPage />} />
        </Route>
        <Route element={<PrivateRoute role="ROLE_USER" />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Route>

        <Route element={<PrivateRoute role="ROLE_ADMIN" />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<ManageEvent />} />  {/* ManageEvent Page */}
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/locations" element={<ManageLocations />} />
          <Route path="/admin/analytics" element={<AnalyticsReports />} />
          <Route path="/admin/payments" element={<AdminPayments />} />




        </Route>

      </Routes>
    </Router>
  );
};

export default AppRoutes;
