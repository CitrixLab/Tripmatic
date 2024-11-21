import React, { useState } from "react";
import axios from "axios"; // Import Axios for making HTTP requests
import "./manualItinerary.css"; // Import the CSS for Manual Itinerary styling
import "./aiItinerary.css"; // Import the CSS for AI Itinerary styling

function AddItinerary() {
  // State to track which form to display (manual or AI)
  const [selectedOption, setSelectedOption] = useState("");

  // States for AI Itinerary Generator
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelerType, setTravelerType] = useState("");
  const [budget, setBudget] = useState("");
  const [activities, setActivities] = useState([]);
  const [generatedItinerary, setGeneratedItinerary] = useState(""); // State to store the generated itinerary

  // States for Manual Itinerary Maker
  const [tripName, setTripName] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [manualStartDate, setManualStartDate] = useState("");
  const [manualEndDate, setManualEndDate] = useState("");
  const [photo, setPhoto] = useState(null);

  // AI Form Activity Checkbox Handler
  const handleActivityChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setActivities([...activities, value]);
    } else {
      setActivities(activities.filter((activity) => activity !== value));
    }
  };

  // AI Form Submission - Makes API call to backend
  const handleSubmitAI = async (event) => {
    event.preventDefault();

    try {
      // Send a POST request to your backend API
      const response = await axios.post(
        "http://localhost:8081/generate-itinerary",
        {
          destination,
          startDate,
          endDate,
          travelerType,
          budget,
          activities,
        }
      );

      // Store the generated itinerary in state
      setGeneratedItinerary(response.data.itinerary);
    } catch (error) {
      console.error("Error generating itinerary:", error);
    }
  };

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

  // Function to handle switching back to the initial selection screen
  const handleBackClick = () => {
    setSelectedOption(""); // Reset to the initial selection screen
  };

  return (
    <div className="add-itinerary-container">
      {selectedOption === "" ? (
        // Initial selection screen
        <div className="selection-screen">
          <h2>Choose Your Itinerary Option</h2>
          <div className="selection-buttons">
            <button onClick={() => setSelectedOption("manual")}>
              Manual Itinerary Maker
            </button>
            <button onClick={() => setSelectedOption("ai")}>
              AI Itinerary Generator
            </button>
          </div>
        </div>
      ) : selectedOption === "manual" ? (
        // Manual Itinerary Maker form
        <div className="manual-itinerary-container">
          {/* Back button in the top-left */}
          <button onClick={handleBackClick} className="back-button">
            Back
          </button>

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
                    src={
                      photo || "https://via.placeholder.com/250x150"
                    } /* Larger placeholder */
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
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        // AI Itinerary Generator form
        <div className="ai-itinerary-container">
          {/* Back button in the top-left */}
          <button onClick={handleBackClick} className="back-button">
            Back
          </button>

          <h2>TripMatic: AI Itinerary Generator</h2>

          <form onSubmit={handleSubmitAI}>
            <div className="form-group">
              <input
                id="destination"
                type="text"
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>
            <div className="form-row-extended">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">Start Date *</label>
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">End Date *</label>
                  <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Select the kind of activities you want to do:</label>
                <div className="activity-checkboxes">
                  <label>
                    <input
                      type="checkbox"
                      value="Standard"
                      onChange={handleActivityChange}
                    />
                    Standard
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="City Experience"
                      onChange={handleActivityChange}
                    />
                    City Experience
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Family Friendly"
                      onChange={handleActivityChange}
                    />
                    Family Friendly
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Nature"
                      onChange={handleActivityChange}
                    />
                    Nature
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Cultural Immersion"
                      onChange={handleActivityChange}
                    />
                    Cultural Immersion
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Foodie"
                      onChange={handleActivityChange}
                    />
                    Foodie
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Adventure"
                      onChange={handleActivityChange}
                    />
                    Adventure
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Eco Friendly"
                      onChange={handleActivityChange}
                    />
                    Eco Friendly
                  </label>
                </div>
              </div>
            </div>
            <div className="form-row-close">
              <div className="form-group">
                <label>Type of Traveler/s</label>
                <select
                  value={travelerType}
                  onChange={(e) => setTravelerType(e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="solo">Solo</option>
                  <option value="couple">Couple</option>
                  <option value="family">Family</option>
                  <option value="group">Group</option>
                </select>
              </div>

              <div className="form-group">
                <label>Budget</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                >
                  <option value="">Select Budget</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <button type="submit">Generate</button>
          </form>

          {/* Display the generated itinerary */}
          {generatedItinerary && (
            <div className="itinerary-result">
              <h3>Generated Itinerary</h3>
              <p>{generatedItinerary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AddItinerary;
