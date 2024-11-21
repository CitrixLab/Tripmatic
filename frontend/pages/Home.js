import React, { useState, useEffect } from "react";
import { bgs } from "../bgimages";
import "./Home.css";
import ha1 from "../homeassets/3.png";
import ha2 from "../homeassets/4.png";
import ha3 from "../homeassets/5.png";
import ha4 from "../homeassets/6.png";
import ha5 from "../homeassets/7.png";
import ha6 from "../homeassets/8.png";
import feed from "../homeassets/feed.png";
import offline from "../homeassets/offline.png";
import cute from "../homeassets/cute.png";

function Home({ isLoggedIn }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bgs.length);
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % bgs.length);
    }, 3000); // Change image every 3 seconds

    return () => {
      clearInterval(intervalId); // Clean up the interval when the component unmounts
    };
  }, []);

  return (
    <div className="movingBG">
      <div className="home">
        <div className="homesection">
          <h1>One app for all your travel planning needs</h1>
          <p className="tight">
            Create detailed itineraries, explore user-shared guides, and manage
            your bookings seamlessly — all in one place.
          </p>
          <a
            href={`${isLoggedIn ? "/manualitinerary" : "/login"}`}
            className="capsulebutton"
          >
            Start Planning
          </a>
        </div>
        <div className="homesection2">
          {bgs.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slideshow ${index}`}
              className={`fade-image ${
                currentImageIndex === index ? "show" : ""
              }`}
              style={{
                transitionDelay: `${index === currentImageIndex ? 0 : 0.5}s`,
              }}
            />
          ))}
        </div>
        <div className="homesection3 extramargin">
          <h1>The only tool you'll ever need</h1>
          <p className="tight">
            Tripmatic is the ultimate travel companion, empowering you to
            effortlessly create personalized itineraries for unforgettable
            adventures.
          </p>
          <div className="flexrow">
            <div className="featurecard">
              <img src={ha1} alt="tripmatic" />
              <h1>Manually Create Itinerary</h1>
              <p>Craft your perfect trip, one stop at a time</p>
            </div>

            <div className="featurecard">
              <img src={ha2} alt="tripmatic" />
              <h1>AI-Generated Itinerary</h1>
              <p>Get a personalized travel plan crafted by AI magic</p>
            </div>

            <div className="featurecard">
              <img src={ha3} alt="tripmatic" />
              <h1>Community Interaction</h1>
              <p>Connect, share, and explore with fellow travelers</p>
            </div>
          </div>
          <div className="flexrow">
            <div className="featurecard">
              <img src={ha4} alt="tripmatic" />
              <h1>Track Expenses</h1>
              <p>Keep your travel budget on point, every step of the way</p>
            </div>
            <div className="featurecard">
              <img src={ha5} alt="tripmatic" />
              <h1>Add Notes</h1>
              <p>Jot down your travel thoughts and details in one place</p>
            </div>

            <div className="featurecard">
              <img src={ha6} alt="tripmatic" />
              <h1>View Map</h1>
              <p>See your journey unfold on an interactive map</p>
            </div>
          </div>
        </div>

        <div className="homesection3 extramargin">
          <h1>Discover your next destination</h1>

          <p className="tight">
            Lost on where to go next? Let us be your compass, guiding you to
            hidden gems and must-see spots around the world!
          </p>
          <div className="featuresection">
            <img src={feed} alt="tripmatic" />
            <div className="featuretext"></div>
          </div>
          <div className="flexrow2">
            <div className="featuresectionhalf">
              <img src={offline} alt="tripmatic" />
              <div className="featuretext2">
                <h1>Offline Access</h1>
                <p>
                  Enjoy the convenience of offline accessibility - with the
                  option to download and save your plans as a PDF, you can
                  always have your information at hand, no matter where you are.
                </p>
              </div>
            </div>
            <div className="featuresectionhalf">
              <img src={cute} alt="tripmatic" />
              <div className="featuretext2">
                <h1>Connect with peers</h1>
                <p>
                  Join a community of like-minded travelers and connect with
                  peers who share your passion for adventure. Share tips,
                  stories, and insights to make every journey unforgettable.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="homesection2 extramargin">
          <h1>Ready to plan your trip in half the time?</h1>
          <div className="flexrow">
            <a
              href={`${isLoggedIn ? "/manualitinerary" : "/login"}`}
              className="capsulebutton"
            >
              Start Planning
            </a>
          </div>
        </div>

        {/* <div className="hometext">
          <p>✈️Plan your trip.</p>
                    <h1>Tripmatic:</h1>
                    <h3>Plan Your Adventure,</h3>
                    <h3>Explore the World.</h3>
                    <h2>Whether you prefer crafting your journey manually or generating it </h2>
                    <h2>effortlessly with AI, Tripmatic offers the perfect blend of control and </h2>
                    <h2> convenience to tailor your dream itinerary seamlessly.</h2> 
        </div>
        <div className="homeLogo">
          <img src="../home.png" alt="logo" />
        </div>  */}
      </div>
    </div>
  );
}

export default Home;
