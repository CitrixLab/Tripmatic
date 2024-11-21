import React, { useState } from "react";
import "./manualItinerary.css"; // Import the CSS for Manual Itinerary styling

function ManualItinerary() {
  const [tripName, setTripName] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [manualStartDate, setManualStartDate] = useState("");
  const [manualEndDate, setManualEndDate] = useState("");
  const [photo, setPhoto] = useState(null);

  // Manual Itinerary Form Photo Change Handler
  const handlePhotoChange = (event) => {
    setPhoto(URL.createObjectURL(event.target.files[0]));
  };

  // Manual Itinerary Form Reset
  const handleCancel = () => {
    setTripName("");
    setDestinationCity("");
    setManualStartDate("");
    setManualEndDate("");
    setPhoto(null);
  };

  // Manual Itinerary Form Submission
  const handleSubmitManual = (event) => {
    event.preventDefault();
    console.log({
      tripName,
      destinationCity,
      manualStartDate,
      manualEndDate,
    });
    // Add logic for saving the trip
  };

  return (
    <div className="manual-itinerary-container">
      <form onSubmit={handleSubmitManual}>
        <div className="form-section">
          <h2>Add Trip</h2>
          <p>Add a trip manually below.</p>

          {/* Trip Name and Destination City with Photo Upload beside both */}
          <div className="form-group-with-photo">
            <div style={{ width: "100%" }}>
              {/* Adjust width to make inputs longer */}
              {/* Trip Name */}
              <div className="form-group">
                <label htmlFor="tripName">Trip Name *</label>
                <input
                  type="text"
                  id="tripName"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  required
                  placeholder="Enter trip name"
                />
              </div>
              {/* Destination City */}
              <div className="form-group">
                <label htmlFor="destinationCity">Destination City *</label>
                <input
                  type="text"
                  id="destinationCity"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  required
                  placeholder="Enter destination"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div className="photo-upload">
              <img
                src={photo || "https://via.placeholder.com/250x150"}
                alt="Trip"
                className="trip-photo-large"
              />
              <label htmlFor="photoUpload" className="change-photo-label">
                <input
                  type="file"
                  id="photoUpload"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                />
                <i className="fa fa-camera"></i> Change Photo
              </label>
            </div>
          </div>

          {/* Start Date and End Date */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="manualStartDate">Start Date *</label>
              <input
                type="date"
                id="manualStartDate"
                value={manualStartDate}
                onChange={(e) => setManualStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="manualEndDate">End Date *</label>
              <input
                type="date"
                id="manualEndDate"
                value={manualEndDate}
                onChange={(e) => setManualEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="button-group">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ManualItinerary;
