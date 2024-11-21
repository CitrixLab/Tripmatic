// // import React from "react";
// import { Link, useNavigate } from "react-router-dom"; 
// import "./userdropdown.css";
// // import { CgProfile } from "react-icons/cg";

// function UserDropdown({ isLoggedIn, setIsLoggedIn, profileCard }) {
//     const navigate = useNavigate(); 
    
//     const handleLogout = (e) => {
//         e.preventDefault(); 
//         localStorage.removeItem("userToken");
//         setIsLoggedIn(false); 
//         navigate("/"); 
//     };

//     return (
//         <div className="notificationsContainer">
//             <img src={profileCard} alt="Profile" style={{ width: "25px", height: "25px", borderRadius: "50%" }} />
//             <div className="hoverContainer">
//                 <div className="notificationContentActive" style={{ maxWidth: "9rem" }}>
//                     <div className="content">
//                         <div className="notifs">
//                             <Link to="/userprofile" className="logoutlink">User  Profile</Link>
//                         </div>
//                         <div className="notifs">
//                             <Link to="/settings" className="logoutlink">Settings</Link>
//                         </div>
//                         <div className="notifs">
//                             <Link to="/" className="logoutlink" onClick={handleLogout}>Log out</Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default UserDropdown;
import { Link, useNavigate } from "react-router-dom"; 
import "./userdropdown.css";

function UserDropdown({ isLoggedIn, setIsLoggedIn, profileCard }) {
    const navigate = useNavigate(); 
    const defaultProfileImage = "https://placehold.co/400"; // Default profile image URL
    

    const handleLogout = (e) => {
        e.preventDefault(); 
        localStorage.removeItem("userToken");
        setIsLoggedIn(false); 
        navigate("/"); 
    };

    return (
        <div className="notificationsContainer">
            <img 
                src={profileCard || "https://placehold.co/400"} 
                
                alt="Profile" 
                style={{ width: "25px", height: "25px", borderRadius: "50%" }} 
            />
            <div className="hoverContainer">
                <div className="notificationContentActive" style={{ maxWidth: "9rem" }}>
                    <div className="content">
                        <div className="notifs">
                            <Link to="/userprofile" className="logoutlink">User  Profile</Link>
                        </div>
                        <div className="notifs">
                            <Link to="/settings" className="logoutlink">Settings</Link>
                        </div>
                        <div className="notifs">
                            <Link to="/" className="logoutlink" onClick={handleLogout}>Log out</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    console.log("Profile Card in UserDropdown: ", profileCard);
}

export default UserDropdown;