import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const PaymentPage = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate(); 

  const [totalAmount, setTotalAmount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.jwtToken;
  const userId = user?.userId;

  useEffect(() => {
    const fetchTotalAmount = async () => {
      try {
        const response = await api.get(`/expenses/total/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalAmount(response.data);
      } catch (error) {
        console.error("Error fetching total amount:", error);
      }
    };

    const verifyPayment = async () => {
      try {
        const response = await api.get(`/payments/verify-payment`, {
          params: { userId, eventId },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setIsPaid(true);
          setPaymentStatus("You have successfully joined the event.");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
      }
    };

    if (userId) {
      fetchTotalAmount();
      verifyPayment();
    }
  }, [eventId, userId, token]);

  const handleJoinEvent = async () => {
    try {
      await api.post(`/events/${eventId}/join/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("User successfully joined the event.");
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  const handlePayment = async () => {
    try {
      if (!userId || !phoneNumber) {
        alert("Please enter your phone number before proceeding.");
        return;
      }

      const orderResponse = await api.post(
        "/payments/create-order",
        { amount: totalAmount, phno: phoneNumber, userId, eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderResponse.data.razorpayOrderId) {
        throw new Error("Order creation failed. Missing Razorpay order ID.");
      }

      const { razorpayOrderId, amount } = orderResponse.data;

      const options = {
        key: "rzp_test_Q0WD3rgIED0ILF",
        amount: amount *100,
        currency: "INR",
        name: "PlanIT Event",
        description: "Event Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            await api.post(
              "/payments/handle-payment-callback",
              response,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            setPaymentStatus("Payment Successful!");
            alert("Payment Successful! You have joined the event.");
            setIsPaid(true);

            // Call API to store eventId and userId in the table
            await handleJoinEvent();

            //Redirect to Invoice Page
            navigate(`/invoice/${eventId}`);
          } catch (error) {
            console.error("Error updating payment:", error);
            alert("Payment successful, but verification failed.");
          }
        },
        prefill: {
          name: user?.username || "User",
          email: user?.email || "user@example.com",
          contact: phoneNumber,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error.response ? error.response.data : error);
      alert("Failed to process payment.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg">
        <h2 className="text-center text-primary">Payment for Event</h2>
        <p><strong>Total Amount:</strong> ₹{totalAmount.toFixed(2)}</p>

        {isPaid ? (
          <>
            <p className="text-success">{paymentStatus}</p>
            <div className="d-flex justify-content-center mt-3">
              <button className="btn btn-secondary" onClick={() => navigate(`/invoice/${eventId}`)}>
                View Invoice
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-3">
              <label className="form-label">Enter Your Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <p>{paymentStatus}</p>
            <div className="d-flex justify-content-center">
              <button className="btn btn-primary" onClick={handlePayment}>
                Pay and Join
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
