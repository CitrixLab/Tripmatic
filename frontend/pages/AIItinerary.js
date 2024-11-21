import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios for making HTTP requests
import { useLocation } from "react-router-dom"; // Import useLocation hook
import "./aiItinerary.css"; // Import the CSS for AI Itinerary styling

function AIItinerary() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelerType, setTravelerType] = useState("");
  const [budget, setBudget] = useState("");
  const [activities, setActivities] = useState([]);
  const [generatedItinerary, setGeneratedItinerary] = useState(""); // State to store the generated itinerary
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const location = useLocation(); // Hook to detect route changes

  // AI Form Activity Checkbox Handler
  const handleActivityChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setActivities([...activities, value]);
    } else {
      setActivities(activities.filter((activity) => activity !== value));
    }
    console.log("Selected Activities:", activities); // Log activities
  };

  // AI Form Submission - Makes API call to backend
  const handleSubmitAI = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Reset error message before API call

    try {
      console.log("Sending request to generate itinerary...");

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

      console.log("Received response from API:", response);

      if (response.data.itinerary) {
        setGeneratedItinerary(response.data.itinerary);

        // Optionally clear the form fields after successful submission
        setDestination("");
        setStartDate("");
        setEndDate("");
        setTravelerType("");
        setBudget("");
        setActivities([]);
      } else {
        setErrorMessage("Failed to generate an itinerary. Please try again.");
      }
    } catch (error) {
      console.error("Error generating itinerary:", error);
      setErrorMessage(
        error.response?.data?.error ||
          "Error generating itinerary. Please try again."
      );
    }
  };

  // useEffect to clear the generated itinerary when the user navigates away
  useEffect(() => {
    return () => {
      setGeneratedItinerary(""); // Clear itinerary on component unmount
    };
  }, [location.pathname]); // Trigger effect when the path changes

  return (
    <div className="ai-itinerary-container">
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
              <label htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
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
            <select value={budget} onChange={(e) => setBudget(e.target.value)}>
              <option value="">Select Budget</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <button type="submit">Generate</button>
      </form>

      {/* Display the error message if there is one */}
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Display the generated itinerary */}
      {generatedItinerary && (
        <div className="itinerary-result">
          <h3>Generated Itinerary</h3>
          <p>{generatedItinerary}</p>
        </div>
      )}
    </div>
  );
}

export default AIItinerary;
