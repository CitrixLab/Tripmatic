import "./App.css";
import Navbar from "./Navbar.js";
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Feed from "./pages/Feed.js";
import UserProfile from "./UserProfile";
import UserDropdown from "./UserDropdown";
import Settings from "./Settings";
import RecommendationPage from "./pages/RecommendationPage.js";
import AddItinerary from "./pages/AddItinerary.js"; // Import AddItinerary component
import ManualItinerary from "./pages/ManualItinerary.js"; // Import Manual Itinerary component
import AIItinerary from "./pages/AIItinerary.js"; // Import AI Itinerary component
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import ChangePassword from "./pages/reset-password/change-password.js";
import "leaflet/dist/leaflet.css";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [profileCard, setProfileCard] = useState("https://placehold.co/400"); // Default profile image
  return (
    <BrowserRouter className="App">
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        profileCard={profileCard}
      />
      {/* <UserDropdown isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} profileCard={profileCard} /> */}
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />}></Route>
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        ></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route
          path="/feed"
          element={
            isLoggedIn ? <Feed /> : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        ></Route>
		<Route path="/addItinerary" element={<AddItinerary />}></Route>
        {/* <Route path="/userprofile" element={<UserProfile setIsLoggedIn={setIsLoggedIn} />}></Route> // New route for user profile page */}
        {/* <Route path="/userprofile" element={<UserProfile setProfileCard={setProfileCard} setIsLoggedIn={setIsLoggedIn} />}></Route>  */}
        <Route path="/userprofile" element={<UserProfile setProfileCard={setProfileCard} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/settings" element={<Settings />}></Route> // New route for user settings page
        <Route path="/recommendation/:token?" element={<RecommendationPage setIsLoggedIn={setIsLoggedIn} />}></Route>
        <Route path="/reset-password/:hash/:token" element={<ChangePassword />} />																  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
