import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminManageLocations.css"; // Add custom styles

const ManageLocations = () => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({ name: "", type: "", address: "" });
  const [editLocation, setEditLocation] = useState(null);
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("user"));
  const token = admin?.jwtToken;

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await api.get("/locations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations", error);
    }
  };

  const handleAddLocation = async () => {
    try {
      const response = await api.post("/locations", newLocation, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      setLocations([...locations, response.data]);
      setNewLocation({ name: "", type: "", address: "" });
      alert("Location added successfully!");
    } catch (error) {
      console.error("Error adding location", error);
    }
  };

  const handleEditLocation = async () => {
    try {
      await api.put(`/locations/${editLocation.id}`, editLocation, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLocations(locations.map((loc) => (loc.id === editLocation.id ? editLocation : loc)));
      setEditLocation(null);
      alert("Location updated successfully!");
    } catch (error) {
      console.error("Error updating location", error);
    }
  };

  const handleDeleteLocation = async (locationId) => {
    try {
      await api.delete(`/locations/${locationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLocations(locations.filter((location) => location.id !== locationId));
      alert("Location deleted successfully!");
    } catch (error) {
      console.error("Error deleting location", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Manage Locations</h2>

      {/* Add Location Form */}
      <div className="card p-3 shadow">
        <h5 className="mb-3">Add New Location</h5>
        <div className="row">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Location Name"
              value={newLocation.name}
              onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Location Type"
              value={newLocation.type}
              onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              value={newLocation.address}
              onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
            />
          </div>
        </div>
        <button className="btn btn-success mt-3" onClick={handleAddLocation}>
          <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Location
        </button>
      </div>

      {/* Location List */}
      <div className="table-responsive mt-4">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No locations found.</td>
              </tr>
            ) : (
              locations.map((location) => (
                <tr key={location.id}>
                  <td>{location.id}</td>
                  <td>{location.name}</td>
                  <td>{location.type}</td>
                  <td>{location.address}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => setEditLocation(location)}
                    >
                      <FontAwesomeIcon icon={faEdit} className="me-1" /> Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteLocation(location.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} className="me-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Location Form */}
      {editLocation && (
        <div className="card p-3 shadow mt-4">
          <h5 className="mb-3">Edit Location</h5>
          <div className="row">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                value={editLocation.name}
                onChange={(e) => setEditLocation({ ...editLocation, name: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                value={editLocation.type}
                onChange={(e) => setEditLocation({ ...editLocation, type: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                value={editLocation.address}
                onChange={(e) => setEditLocation({ ...editLocation, address: e.target.value })}
              />
            </div>
          </div>
          <button className="btn btn-primary mt-3" onClick={handleEditLocation}>
            Update Location
          </button>
          <button className="btn btn-secondary mt-3 ms-2" onClick={() => setEditLocation(null)}>
            Cancel
          </button>
        </div>
      )}

      <button className="btn btn-secondary mt-3" onClick={() => navigate("/admin-dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default ManageLocations;
