import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import "../../styles/ManageEvent.css"; // Custom CSS

const ManageEvent = () => {

  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("user"));
  const token = admin?.jwtToken;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const deleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(events.filter(event => event.id !== eventId));
        alert("Event deleted successfully!");
      } catch (error) {
        console.error("Error deleting event", error);
      }
    }
  };

  return (
    <div className="manage-events-container">
      <h2 className="text-center mb-4">Manage Events</h2>

      <div className="row">
        {events.length === 0 ? (
          <p className="text-center">No events found.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="col-md-6 mb-4">
              <div className="card event-card shadow">
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  <p><strong>Date:</strong> {event.date}</p>
                  <p><strong>Location:</strong> {event.location.name}</p>
                  <p><strong>Description:</strong> {event.description}</p>

                  {/* Remove Event Button */}
                  <button
                    className="btn btn-danger w-100"
                    onClick={() => deleteEvent(event.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-2" /> Remove Event
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/admin-dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default ManageEvent;
