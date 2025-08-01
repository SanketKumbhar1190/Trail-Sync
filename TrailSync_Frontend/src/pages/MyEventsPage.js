import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const MyEventsPage = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [expenses, setExpenses] = useState({});
  const [participantsCount, setParticipantsCount] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.jwtToken;

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await api.get("/events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userEvents = response.data.filter(event => event.user.id === user.userId);
        setMyEvents(userEvents);

        userEvents.forEach(event => {
          fetchExpenses(event.id);
          fetchParticipantsCount(event.id);  // Fetch participants count
        });
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    const fetchExpenses = async (eventId) => {
      try {
        const response = await api.get(`/expenses/event/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setExpenses(prev => ({ ...prev, [eventId]: response.data }));
      } catch (error) {
        console.error(`Error fetching expenses for event ${eventId}`, error);
      }
    };

    const fetchParticipantsCount = async (eventId) => {
      try {
        const response = await api.get(`/events/${eventId}/participants`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setParticipantsCount(prev => ({
          ...prev,
          [eventId]: response.data.length,  // Set the count of participants
        }));
      } catch (error) {
        console.error(`Error fetching participants for event ${eventId}`, error);
      }
    };

    fetchMyEvents();
  }, []);

  const deleteEvent = async (eventId) => {
    try {
      await api.delete(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMyEvents(myEvents.filter(event => event.id !== eventId));
      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };

  const deleteExpense = async (expenseId, eventId) => {
    try {
      await api.delete(`/expenses/${expenseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses(prev => ({
        ...prev,
        [eventId]: prev[eventId].filter(expense => expense.id !== expenseId),
      }));

      alert("Expense deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Events</h2>

      <div className="row">
        {myEvents.length === 0 ? (
          <p>No events found.</p>
        ) : (
          myEvents.map((event) => (
            <div key={event.id} className="col-md-6">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
  <h5 className="card-title mb-0">{event.title}</h5>
  <span className="ms-2"><strong>Participant Count:</strong> {participantsCount[event.id] || 0}</span>  {/* Display participants count */}
</div>
                  <br></br>
                  <p><strong>Date:</strong> {event.date}</p>
                  <p><strong>Location:</strong> {event.location.name}</p>
                  <p><strong>Description:</strong> {event.description}</p>

                  {/* Participants count at top-right */}
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-sm btn-info"
                      title="View Participants"
                      onClick={() => navigate(`/event-participants/${event.id}`)}  // Navigate to View Participants page
                    >
                      View Participants
                    </button>
                    {/* <span className="badge bg-primary">{participantsCount[event.id] || 0}</span>  Display participants count */}
                  </div>

                  {/* Event Action Buttons */}
                  <div className="d-flex justify-content-end mt-2">
                    <button
                      className="btn btn-sm btn-primary me-2"
                      title="Edit Event"
                      onClick={() => navigate(`/update-event/${event.id}`)}
                    >
                      <FontAwesomeIcon icon={faEdit} className="me-1" /> Edit Event
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      title="Delete Event"
                      onClick={() => deleteEvent(event.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} className="me-1" /> Delete Event
                    </button>
                  </div>

                  {/* Expense Section */}
                  <h6 className="mt-3"><b>Expenses</b></h6>
                  {expenses[event.id] && expenses[event.id].length > 0 ? (
                    expenses[event.id].map((expense) => (
                      <div key={expense.id} className="border rounded p-2 mb-2 d-flex justify-content-between align-items-center">
                        <div>
                          <p className="mb-1"><strong>{expense.name}</strong></p>
                          <p className="mb-0">₹{expense.amount}</p>
                        </div>

                        {/* Expense Action Buttons */}
                        <div className="d-flex">
                          <button
                            className="btn btn-sm btn-success me-2"
                            title="Edit Expense"
                            onClick={() => navigate(`/update-expense/${event.id}`)}
                          >
                            <FontAwesomeIcon icon={faEdit} className="me-1" /> Edit Expense
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete Expense"
                            onClick={() => deleteExpense(expense.id, event.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} className="me-1" /> Delete Expense
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No expenses added yet.</p>
                  )}

                  {/* Add Expense Button */}
                  <button
                    className="btn btn-sm btn-info mt-2"
                    title="Add Expense"
                    onClick={() => navigate(`/add-expense/${event.id}`)}
                  >
                    <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Expense
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

export default MyEventsPage;
