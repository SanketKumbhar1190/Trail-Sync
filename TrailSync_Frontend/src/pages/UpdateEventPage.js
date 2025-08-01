import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const UpdateEventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState({ title: "", description: "", date: "", locationId: "" });
  const [locations, setLocations] = useState([]); // Store available locations
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("user"))?.jwtToken;

  // Fetch event details and available locations
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setEvent({
          title: response.data.title,
          description: response.data.description,
          date: response.data.date,
          locationId: response.data.location.id, // Store current location ID
        });
      } catch (error) {
        console.error("Error fetching event", error);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await api.get("/locations", { headers: { Authorization: `Bearer ${token}` } });
        setLocations(response.data); // Store available locations
      } catch (error) {
        console.error("Error fetching locations", error);
      }
    };

    fetchEvent();
    fetchLocations();
  }, [id, token]);

  const handleChange = (e) => setEvent({ ...event, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send updated event data
      await api.put(
        `/events/${id}`,
        { ...event, location: { id: event.locationId } }, // Pass location as an object with ID
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Event updated successfully!");
      navigate("/my-events");
    } catch (error) {
      console.error("Error updating event", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input type="text" name="title" value={event.title} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea name="description" value={event.description} onChange={handleChange} className="form-control" required></textarea>
        </div>

        <div className="mb-3">
          <label>Date</label>
          <input type="date" name="date" value={event.date} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label>Location</label>
          <select name="locationId" value={event.locationId} onChange={handleChange} className="form-control" required>
            <option value="" disabled>Select a location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Update Event</button>
      </form>
    </div>
  );
};

export default UpdateEventPage;
