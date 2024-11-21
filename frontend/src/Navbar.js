import React from "react";
import { Link } from "react-router-dom"; // Use useNavigate for navigation
import "./index.css";
import Notifications from "./Notifications";
import { FaHome } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import UserDropdown from "./UserDropdown";
import image from "./pages/assets/logo.png";
// import { MdLocationOn } from "react-icons/md";
// import { IoPerson } from "react-icons/io5";

function Navbar({ isLoggedIn, setIsLoggedIn, profileCard }) {
  //const navigate = useNavigate(); // React Router hook to programmatically navigate

  const items = [
    {
      id: 0,
      name: "Mika Cruz",
      isLocation: false,
    },
    {
      id: 1,
      name: "Japan",
      isLocation: true,
    },
    {
      id: 2,
      name: "Italy",
      isLocation: true,
    },
    {
      id: 3,
      name: "Kayla Cruz",
      isLocation: false,
    },
    {
      id: 4,
      name: "Paolo Santos",
      isLocation: false,
    },
    {
      id: 5,
      name: "Miggy Calimlim",
      isLocation: false,
    },
  ];

  const handleOnSearch = (string, results) => {
    console.log(string, results);
  };

  const handleOnHover = (result) => {
    console.log(result);
  };

  const handleOnSelect = (item) => {
    console.log(item);
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const formatResult = (item) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          textAlign: "left",
        }}
      >
        <div>{`${item.id} - ${item.name}`}</div>
      </div>
    );
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={image} alt="logo" className="logoimage" />
        </Link>
      </div>
      <ul className="nav-links">
        {!isLoggedIn ? null : (
          <Link to={!isLoggedIn ? "/" : "/feed"} className="linkWithLogo">
            <FaHome color="#303030" size={25} />
            <div className="linkText">Home</div>
          </Link>
        )}

        {!isLoggedIn ? (
          <>
            <Link to="/login" className="linkWithLogo">
              <div className="linkText2">Login</div>
            </Link>

            <Link to="/register" className="capsulebuttonsignup">
              <div className="linkText2">Sign Up</div>
            </Link>
          </>
        ) : (
          <>
            {/* Add Itinerary Dropdown */}
            <div className="addItineraryContainer notificationsContainer">
              <FaCirclePlus color="#303030" size={25} />
              <div className="dropbtn">Add Itinerary</div>
              <div className="hoverContainer">
                <div className="addItineraryDropdownActive notificationContentActive">
                  <div className="addItineraryOption notifs">
                    <Link to="/manualItinerary">Manual Itinerary Maker</Link>
                  </div>
                  <div className="addItineraryOption notifs">
                    <Link to="/aiItinerary">AI Itinerary Generator</Link>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ width: "250px" }}>
              <ReactSearchAutocomplete
                items={items}
                onSearch={handleOnSearch}
                onHover={handleOnHover}
                onSelect={handleOnSelect}
                onFocus={handleOnFocus}
                autoFocus
                formatResult={formatResult}
                styling={{
                  searchIconMargin: "0 0 0 16px",
                }}
                className="search"
              />
            </div>

            <Notifications />

            <UserDropdown
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              profileCard={profileCard}
            />
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
