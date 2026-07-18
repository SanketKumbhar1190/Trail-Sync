import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const AddExpense = () => {
  const { eventId } = useParams(); // Get event ID from URL
  const [expense, setExpense] = useState({
    name: "",
    amount: "",
    description: "",
  });
  const [splitType, setSplitType] = useState("none");
  const [participants, setParticipants] = useState([]);
  const [shares, setShares] = useState({});

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
  const token = user?.jwtToken; // Get JWT token

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await api.get(`/events/${eventId}/participants`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setParticipants(response.data || []);
        const initialShares = {};
        (response.data || []).forEach((p) => {
          initialShares[p.id] = "";
        });
        setShares(initialShares);
      } catch (error) {
        console.error("Error fetching participants", error);
      }
    };

    if (eventId && token) {
      fetchParticipants();
    }
  }, [eventId, token]);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleShareChange = (participantId, value) => {
    setShares({ ...shares, [participantId]: value });
  };

  const buildSharesPayload = () => {
    const payload = {};
    Object.keys(shares).forEach((id) => {
      if (shares[id] !== "" && shares[id] != null) {
        payload[id] = parseFloat(shares[id]);
      }
    });
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        name: expense.name,
        amount: parseFloat(expense.amount), // Convert to float
        description: expense.description,
      };

      if (splitType === "none") {
        await api.post(`/expenses/add/${eventId}`, requestData, {
          headers: { Authorization: `Bearer ${token}` }, // Send JWT token
        });
      } else {
        const splitPayload = {
          ...requestData,
          shares:
            splitType === "equal" ? {} : buildSharesPayload(),
        };

        await api.post(`/expenses/split/${eventId}?splitType=${splitType}`, splitPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      alert("Expense added successfully!");
      navigate("/user-dashboard"); // Redirect back to dashboard
    } catch (error) {
      console.error("Error adding expense", error);
      alert(error.response?.data?.message || error.response?.data || "Failed to add expense.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Expense for Event {eventId}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Expense Name</label>
          <input type="text" name="name" className="form-control" value={expense.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Amount</label>
          <input type="number" step="0.01" name="amount" className="form-control" value={expense.amount} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea name="description" className="form-control" value={expense.description} onChange={handleChange} required></textarea>
        </div>
        <div className="mb-3">
          <label>Split Type</label>
          <select
            className="form-control"
            value={splitType}
            onChange={(e) => setSplitType(e.target.value)}
          >
            <option value="none">No split (save full amount)</option>
            <option value="equal">Equal</option>
            <option value="percentage">Percentage</option>
            <option value="individual">Individual</option>
          </select>
        </div>
        {(splitType === "percentage" || splitType === "individual") && (
          <div className="mb-3">
            <label className="mb-2">
              {splitType === "percentage"
                ? "Percentage per participant (must total 100)"
                : "Amount per participant (must total expense amount)"}
            </label>
            {participants.length === 0 ? (
              <p className="text-muted">No participants found for this event.</p>
            ) : (
              participants.map((participant) => (
                <div key={participant.id} className="mb-2">
                  <label>{participant.username || participant.email || `User ${participant.id}`}</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={shares[participant.id] ?? ""}
                    onChange={(e) => handleShareChange(participant.id, e.target.value)}
                    required
                  />
                </div>
              ))
            )}
          </div>
        )}
        <button type="submit" className="btn btn-success">Add Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;
