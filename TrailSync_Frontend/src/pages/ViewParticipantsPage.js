import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";

const ViewParticipantsPage = () => {
  const [participants, setParticipants] = useState([]);
  const { eventId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.jwtToken;

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await api.get(`/events/${eventId}/participants`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setParticipants(response.data);
      } catch (error) {
        console.error("Error fetching participants", error);
      }
    };

    fetchParticipants();
  }, [eventId]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Participants for Event {eventId}</h2>

      <div className="list-group">
        {participants.length === 0 ? (
          <p>No participants found.</p>
        ) : (
          participants.map((participant) => (
            <div key={participant.id} className="list-group-item">
              <h5>{participant.name}</h5>
              <p><strong>Email:</strong> {participant.email}</p>
            </div>
          ))
        )}
      </div>

      <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate("/my-events")}
      >
        Back to My Events
      </button>
    </div>
  );
};

export default ViewParticipantsPage;
