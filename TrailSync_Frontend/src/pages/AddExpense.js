import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const AddExpense = () => {
  const { eventId } = useParams(); // Get event ID from URL
  const [expense, setExpense] = useState({
    name: "",
    amount: "",
    description: "",
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
  const token = user?.jwtToken; // Get JWT token

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        name: expense.name,
        amount: parseFloat(expense.amount), // Convert to float
        description: expense.description,
      };

      await api.post(`/expenses/add/${eventId}`, requestData, {
        headers: { Authorization: `Bearer ${token}` }, // Send JWT token
      });

      alert("Expense added successfully!");
      navigate("/user-dashboard"); // Redirect back to dashboard
    } catch (error) {
      console.error("Error adding expense", error);
      alert("Failed to add expense.");
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
        <button type="submit" className="btn btn-success">Add Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;
