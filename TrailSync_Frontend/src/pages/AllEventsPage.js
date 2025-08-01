import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa"; // Import Flaticon icon using react-icons package
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported for styling
import "../styles/AllEventsPage.css"; // Custom CSS for hover effects and other tweaks

const AllEventsPage = () => {
  const [events, setEvents] = useState([]); // State for all events
  const [filteredEvents, setFilteredEvents] = useState([]); // State for filtered events based on location
  const [location, setLocation] = useState(""); // Location state
  const navigate = useNavigate(); // Hook to navigate between pages

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events"); // Get all events without authentication (public)
        setEvents(response.data);
        setFilteredEvents(response.data); // Initially, all events are displayed
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    fetchEvents();
  }, []);

  // Handle search event and filter based on location
  const handleSearch = () => {
    if (location) {
      const filtered = events.filter((event) =>
        event.location.name.toLowerCase().includes(location.toLowerCase())
      );
      setFilteredEvents(filtered); // Update the filtered events state
    } else {
      setFilteredEvents(events); // Reset to all events if no location is provided
    }
  };

  // Navigate to event details page
  const handleViewDetails = (eventId) => {
    navigate(`/event/${eventId}`); // Navigate to the event details page
  };

  return (
    <div className="container mt-4" style={{        backgroundColor: "#ECF0F1", // Light background color for the page
    }}>
      <h2 className="mb-4 text-center" style={{ color: "#34495E" }}>
        All Events
      </h2>

      {/* Minimal Search Bar with Flaticon icon */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search events by location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                borderRadius: "50px",
                padding: "10px 20px",
                fontSize: "16px",
              }}
            />
            <button
              onClick={handleSearch}
              className="btn"
              style={{
                borderRadius: "50px",
                padding: "10px 15px", // Adjust padding for better visibility
                marginLeft: "-50px", // Adjust margin to place the button next to the search bar
                border: "none",
                display: "flex",
                alignItems: "center", // Ensure the icon is vertically aligned
              }}
            >
              <FaSearch
                style={{
                  fontSize: "20px",
                  color: "#121212",
                  margin: 0, // Remove any extra margin around the icon
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Display Events as Bootstrap Cards */}
      <div className="row">
        {filteredEvents.length === 0 ? (
          <p>No events found.</p>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="col-md-4 mb-4"
              onClick={() => handleViewDetails(event.id)} // Navigate to event details on card click
              style={{ cursor: "pointer" }}
            >
              <div className="card event-card shadow-lg">
                <div className="card-body">
                  <h5 className="card-title" style={{ color: "#2980B9" }}>
                    {event.title}
                  </h5>
                  <p className="card-text">
                    <strong>Date:</strong> {event.date}
                  </p>
                  <p className="card-text">
                    <strong>Location:</strong> {event.location.name}
                  </p>
                  <button
                    className="btn btn-primary w-100 event-button"
                    onClick={() => handleViewDetails(event.id)} // Navigate to event details on button click
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllEventsPage;
