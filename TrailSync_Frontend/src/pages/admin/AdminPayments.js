import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("user"));
  const token = admin?.jwtToken;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get("/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(response.data);

      // Calculate total revenue
      const revenue = response.data.reduce((sum, payment) => sum + payment.amount, 0);
      setTotalRevenue(revenue);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  console.log(payments);

  const handleRefund = async (paymentId) => {
    try {
      await api.post(`/payments/refund/${paymentId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Refund successful!");
      fetchPayments(); // Refresh data after refund
    } catch (error) {
      console.error("Error processing refund:", error);
      alert("Failed to process refund.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary">Admin Payment Management</h2>
      <br></br>
      {/* Revenue Section */}
      {/* <div className="card p-3 shadow my-4">
        <h4 className="text-success text-center">Total Revenue: ₹{totalRevenue.toFixed(2)}</h4>
      </div> */}

      {/* Payment Transactions */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Payment ID</th>
              <th>Amount (₹)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>₹{payment.amount.toFixed(2)}</td>
                  <td>{payment.orderStatus}</td>
                  <td>
                    {payment.orderStatus === "PAYMENT_COMPLETED" ? (
                      <button className="btn btn-warning" onClick={() => handleRefund(payment.id)}>
                        Refund
                      </button>
                    ) : (
                      <span className="text-muted">No Action</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No payments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Back Button */}
      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-secondary" onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminPayments;
