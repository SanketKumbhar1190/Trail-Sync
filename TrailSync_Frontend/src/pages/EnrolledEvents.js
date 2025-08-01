import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const EnrolledEvents = () => {
  const [enrolledEvents, setEnrolledEvents] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.jwtToken;
  const userId = user?.userId;

  useEffect(() => {
    const fetchEnrolledEvents = async () => {
      try {
        const response = await api.get(`/events/enrolled/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrolledEvents(response.data);
      } catch (error) {
        console.error("Error fetching enrolled events", error);
      }
    };

    if (userId) {
      fetchEnrolledEvents();
    }
  }, [userId, token]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Enrolled Events</h2>

      {enrolledEvents.length === 0 ? (
        <p>You haven't enrolled in any events yet.</p>
      ) : (
        <div className="row">
          {enrolledEvents.map((event) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledEvents;
