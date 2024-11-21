import React, { useState } from "react";
import "./feed.css";
import { FaHeart } from "react-icons/fa";
import { FaComments } from "react-icons/fa";

function Feed() {
  const navLabels = ["Famous Itineraries", "People you follow"];
  const [selectedNav, setSelectedNav] = useState("Famous Itineraries");

  const sampleItineraries = [
    {
      title: "The Best in Japan",
      description: "This shows the simplest way to enjoy Japan fully.",
      image:
        "https://images.hdqwalls.com/download/churei-tower-mount-fuji-in-japan-8k-68-7680x4320.jpg",
      profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
      username: "Ely Sy",
      numberOfComments: 33,
      numberOfLikes: 50,
      followed: true,
      liked: true,
    },
    {
      title: "Exploring the Alps",
      description: "A thrilling adventure in the heart of the Swiss Alps.",
      image: "https://wallpapercave.com/wp/wp5377481.jpg",
      profilePicture: "https://randomuser.me/api/portraits/women/65.jpg",
      username: "Lara Winters",
      numberOfComments: 42,
      numberOfLikes: 75,
      followed: true,

      liked: false,
    },
    {
      title: "A Weekend in Paris",
      description: "The perfect 3-day itinerary to explore the city of lights.",
      image:
        "https://media.staticontent.com/media/pictures/01512cb2-8e58-47ca-addf-c8aadbfcde82",
      profilePicture: "https://randomuser.me/api/portraits/men/22.jpg",
      username: "Jean Luc",
      numberOfComments: 19,
      numberOfLikes: 100,
      followed: false,

      liked: true,
    },
    {
      title: "Safari Adventure in Kenya",
      description:
        "Experience the beauty of Kenya's wildlife in this safari tour.",
      image:
        "https://www.micato.com/wp-content/micato-uploads/2018/10/east-africa-1.jpg",
      profilePicture: "https://randomuser.me/api/portraits/women/43.jpg",
      username: "Amara Blake",
      numberOfComments: 61,
      numberOfLikes: 120,
      followed: false,

      liked: false,
    },
    {
      title: "Discovering Ancient Greece",
      description:
        "Step back in time with this itinerary exploring ancient Greek ruins.",
      image:
        "https://lp-cms-production.imgix.net/2021-05/shutterstockRF_1563449509.jpg?auto=format&fit=crop&sharp=10&vib=20&ixlib=react-8.6.4&w=850&q=35&dpr=3",
      profilePicture: "https://randomuser.me/api/portraits/men/56.jpg",
      username: "Dimitris Ioannou",
      numberOfComments: 12,
      numberOfLikes: 89,
      followed: false,
      liked: false,
    },
  ];

  return (
    <div className="feedContainer">
      <div className="feedBody">
        <div className="feedNav">
          {navLabels.map((x, i) => {
            return (
              <div
                onClick={() => setSelectedNav(x)}
                className={`${
                  x === selectedNav ? "feedLinkActive" : "feedLink"
                }`}
              >
                {x}
              </div>
            );
          })}
        </div>
        {selectedNav === "Famous Itineraries" ? (
          <div
            key={`${selectedNav === "Famous Itineraries" ? "sel" : "not"}`}
            className={`${
              selectedNav === "Famous Itineraries" ? "feedContent" : ""
            }`}
          >
            {sampleItineraries
              .filter((f) => !f.followed)
              .map((x, i) => {
                return (
                  <div className="feedCard">
                    <img src={x.image} alt="no img" className="feedImg" />

                    <div className="feedInformation">
                      <h1>{x.title}</h1>
                      <p>{x.description}</p>
                      <div className="feedCardUserDetails">
                        <div className="feedCardUser">
                          <img
                            src={x.profilePicture}
                            alt="no img"
                            className="feedUserImg"
                          />
                          <div>{x.username}</div>
                        </div>
                        <div className="feedCardDetails">
                          <FaHeart
                            className={`feedHeart ${x.liked ? "hearted" : ""}`}
                            size={25}
                          />
                          <div>{x.numberOfLikes}</div>
                          <FaComments className="feedComment" size={25} />
                          <div>{x.numberOfComments}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div
            key={`${selectedNav !== "Famous Itineraries" ? "sel" : "not"}`}
            className={`${
              selectedNav !== "Famous Itineraries" ? "feedContent" : ""
            }`}
          >
            {sampleItineraries
              .filter((f) => f.followed)
              .map((x, i) => {
                return (
                  <div className="feedCard">
                    <img src={x.image} alt="no img" className="feedImg" />

                    <div className="feedInformation">
                      <h1>{x.title}</h1>
                      <p>{x.description}</p>
                      <div className="feedCardUserDetails">
                        <div className="feedCardUser">
                          <img
                            src={x.profilePicture}
                            alt="no img"
                            className="feedUserImg"
                          />
                          <h1>{x.username}</h1>
                        </div>
                        <div className="feedCardDetails">
                          <FaHeart
                            className={`feedHeart ${x.liked ? "hearted" : ""}`}
                            size={25}
                          />
                          <div>{x.numberOfLikes}</div>
                          <FaComments className="feedComment" size={25} />
                          <div>{x.numberOfComments}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;
