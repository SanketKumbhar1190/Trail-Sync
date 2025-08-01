import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/AdminDashboard.css"; // Add CSS for styling

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Admin Dashboard</h2>

      <div className="row">
        {/* Manage Events */}
        <div className="col-md-4">
          <div className="card admin-card shadow">
            <div className="card-body text-center">
              <h5 className="card-title mt-2">Manage Events</h5>
              <p>Remove events.</p>
              <button className="btn btn-primary w-100" onClick={() => navigate("/admin/events")}>
                Manage Events
              </button>

            </div>
          </div>
        </div>

        {/* Manage Users */}
        <div className="col-md-4">
          <div className="card admin-card shadow">
            <div className="card-body text-center">
              <h5 className="card-title mt-2">Manage Users</h5>
              <p>View and remove users.</p>
              <button className="btn btn-warning w-100" onClick={() => navigate("/admin/users")}>
                Manage Users
              </button>
            </div>
          </div>
        </div>

        {/* Manage Locations */}
        <div className="col-md-4">
          <div className="card admin-card shadow">
            <div className="card-body text-center">
              <h5 className="card-title mt-2">Manage Locations</h5>
              <p>Add, edit, or delete event locations.</p>
              <button className="btn btn-success w-100" onClick={() => navigate("/admin/locations")}>
                Manage Locations
              </button>
            </div>
          </div>
        </div>

        {/* Manage Payments */}
        <div className="col-md-4 mt-4">
          <div className="card admin-card shadow">
            <div className="card-body text-center">
              <h5 className="card-title mt-2">Manage Payments</h5>
              <p>View transactions, refunds, and revenue.</p>
              <button className="btn btn-danger w-100" onClick={() => navigate("/admin/payments")}>
                View Payments
              </button>
            </div>
          </div>
        </div>

        {/* Analytics & Reports */}
        <div className="col-md-4 mt-4">
          <div className="card admin-card shadow">
            <div className="card-body text-center">
              <h5 className="card-title mt-2">Analytics & Reports</h5>
              <p>Track platform performance & trends.</p>
              <button className="btn btn-info w-100" onClick={() => navigate("/admin/analytics")}>
                View Reports
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4 mt-4">
  <div className="card admin-card shadow upcoming-feature">
    <div className="card-body text-center">
      <h5 className="card-title mt-2">Send Notifications</h5>
      <p>Send updates and announcements to users.</p>
      <button className="btn w-100" disabled>
        Send Notification
      </button>
    </div>
  </div>
</div>


      </div>
    </div>
  );
};

export default AdminDashboard;
