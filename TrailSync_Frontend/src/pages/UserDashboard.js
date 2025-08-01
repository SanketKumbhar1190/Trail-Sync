import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = user?.jwtToken;
        const response = await api.get("/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Events</h2>

      {/* Add Event Button */}
      <button className="btn btn-success mb-4" onClick={() => navigate("/create-event")}>
        + Add Event
      </button>

      {/* My Events Button */}
      <button className="btn btn-info mb-4 ms-2" onClick={() => navigate("/my-events")}>
        My Events
      </button>

      {/* New Enrolled Events Button */}
      <button className="btn btn-warning mb-4 ms-2" onClick={() => navigate("/enrolled-events")}>
        Enrolled Events
      </button>

      {/* Display Events as Bootstrap Cards */}
      <div className="row">
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="col-md-4">
              <div
                className="card mb-4 shadow-sm"
                onClick={() => navigate(`/event/${event.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  <p className="card-text"><strong>Date:</strong> {event.date}</p>
                  <p className="card-text"><strong>Location:</strong> {event.location.name}</p>
                  <button className="btn btn-primary w-100">View Details</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
