import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Use useNavigate for navigation
import "./notification.css";
import { IoNotificationsOutline } from "react-icons/io5";
function Notifications() {
  const notifications = [
    "Notification 1",

    "Notification 2",

    "Notification 3",

    "Notification 4",

    "Notification 5",
  ];
  return (
    <div className="notificationsContainer">
      <IoNotificationsOutline color="#303030" size={25} />

      <div className="hoverContainer">
        <div className="notificationContentActive">
          <h1>Notifications</h1>
          <div className="content">
            {notifications.map((x, i) => {
              return (
                <div className="notifs" key={i}>
                  <div>{x}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
