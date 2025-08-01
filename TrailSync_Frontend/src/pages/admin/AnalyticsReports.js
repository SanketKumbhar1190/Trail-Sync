import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../../styles/AdminAnalytics.css"; // Custom styles

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsReports = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [eventData, setEventData] = useState({ dates: [], counts: [] });
  const [loading, setLoading] = useState(true);

  const admin = JSON.parse(localStorage.getItem("user"));
  const token = admin?.jwtToken;

  useEffect(() => {
    fetchAnalytics();
    fetchEventData();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch analytics data
      const analyticsResponse = await api.get("/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Fetch total payments separately
      const paymentsResponse = await api.get("/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Calculate total payments
      const totalPayments = paymentsResponse.data.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
  
      // Set analytics data with total payments
      setAnalyticsData({
        ...analyticsResponse.data,
        totalPayments,
      });
    } catch (error) {
      console.error("Error fetching analytics", error);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchEventData = async () => {
    try {
      const response = await api.get("/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const events = response.data;
      const eventCountByDate = {};

      events.forEach((event) => {
        const date = event.date;
        if (!date) return;

        eventCountByDate[date] = (eventCountByDate[date] || 0) + 1;
      });

      const sortedDates = Object.keys(eventCountByDate).sort();
      const eventCounts = sortedDates.map((date) => eventCountByDate[date]);

      setEventData({ dates: sortedDates, counts: eventCounts });
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading analytics...</div>;
  }

  if (!analyticsData) {
    return <div className="text-center mt-5 text-danger">Failed to load analytics data.</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Analytics & Reports</h2>

      {/* Top Statistics */}
      <div className="row">
        <div className="col-md-4">
          <div className="card stats-card shadow">
            <h5>Total Users</h5>
            <p>{analyticsData.totalUsers || 0}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stats-card shadow">
            <h5>Total Events</h5>
            <p>{analyticsData.totalEvents || 0}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stats-card shadow">
            <h5>Total Payments</h5>
            <p>₹ {analyticsData.totalPayments || 0}</p>
          </div>
        </div>
      </div>

      {/* Event Trends - Bar Chart */}
      <div className="card mt-4 shadow p-3">
        <h5>Event Creation Trends</h5>
        {eventData.dates.length > 0 ? (
          <Bar
            data={{
              labels: eventData.dates,
              datasets: [
                {
                  label: "Events Created",
                  data: eventData.counts,
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: { display: true, text: "Date" },
                },
                y: {
                  title: { display: true, text: "Event Count" },
                  ticks: {
                    stepSize: 1, // Force integer values on Y-axis
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        ) : (
          <p className="text-center">No event trend data available.</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsReports;
