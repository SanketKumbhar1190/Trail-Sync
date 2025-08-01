import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const CreateEvent = () => {
  const [event, setEvent] = useState({
    title: "",
    description: "",
    date: "",
    locationId: "",
    location: {}, // Store full location details
  });
  const [locations, setLocations] = useState([]); // Store all available locations
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
  const token = user?.jwtToken; // Get JWT token

  // Fetch locations from the API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get("/locations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLocations(response.data); // Set locations to state
      } catch (error) {
        console.error("Error fetching locations", error);
        alert("Failed to load locations.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "locationId") {
      // Find the full location object by ID
      const selectedLocation = locations.find((loc) => loc.id.toString() === value);

      setEvent({
        ...event,
        locationId: value,
        location: selectedLocation || {}, // Store full location details
      });
    } else {
      setEvent({ ...event, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare the correct JSON format with full location details
      const requestData = {
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location, // Send full location object
        user: { id: user.userId }, // Include user ID
      };

      const response = await api.post("/events/create", requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Event created successfully!");

      // Extract the newly created event's ID and navigate to Add Expense page
      const eventId = response.data.id;
      navigate(`/add-expense/${eventId}`);
    } catch (error) {
      console.error("Error creating event", error);
      alert("Failed to create event.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={event.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea
            name="description"
            className="form-control"
            value={event.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label>Date</label>
          <input
            type="date"
            name="date"
            className="form-control"
            value={event.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Location</label>
          {loading ? (
            <p>Loading locations...</p>
          ) : (
            <select
              name="locationId"
              className="form-control"
              value={event.locationId}
              onChange={handleChange}
              required
            >
              <option value="">Select Location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name} - {location.type} ({location.address})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Display full location details below dropdown */}
        {event.locationId && (
          <div className="alert alert-info">
            <h5>Selected Location Details:</h5>
            <p><strong>Name:</strong> {event.location.name}</p>
            <p><strong>Type:</strong> {event.location.type}</p>
            <p><strong>Address:</strong> {event.location.address}</p>
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
