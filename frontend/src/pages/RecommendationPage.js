import React, { useEffect } from 'react';
import './Recommendation.css'; // Assuming you have some basic CSS for layout
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Sample data for each influencer
const influencers = [
  { name: 'Micakes Travels', description: 'Travel Planning & Tips!', followers: '1.2k Followers' },
  { name: 'Kyla Cruise', description: 'Travel Blogs', followers: '8.1k Followers' },
  { name: 'Paolo Plane', description: 'WFH + Travel', followers: '800 Followers' },
  { name: 'Miguel Wonders', description: 'Pre-Travel Tips', followers: '10k Followers' },
  { name: 'Ronni R.', description: 'Explore Korea', followers: '148k Followers' },
  { name: 'Lourdes E.', description: 'Budgetarian', followers: '100k Followers' },
  { name: 'Family Travels', description: 'Plan tips with the fam!', followers: '200k Followers' },
  { name: 'Montano Rides TM', description: 'Motorcycle ride in Manila', followers: '3.4k Followers' },
];

// UserCard component to display individual influencer
const UserCard = ({ name, description, followers }) => {
  return (
    <div className="user-card">
      <div className="user-image">
        {/* Placeholder for the user's image */}
        <img src="https://via.placeholder.com/150" alt={name} />
      </div>
      <div className="user-info">
        <h3>{name}</h3>
        <p>{description}</p>
        <p>{followers}</p>
        <a href="/userprofile" className="btn btn-outline-primary wide-button">Follow</a>
      </div>
    </div>
  );
};
// Footer component for the recommendation message
const Footer = () => {
return (
    <div className="footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #ccc', paddingTop: '30px' }}>
        <p>We recommend following 5 sources to find content you care about.</p>
        <a href='/userprofile'> <button className="btn btn-outline-dark">→</button></a>
    </div>
);
};

// Main App component
const App = ({ setIsLoggedIn }) => {
  const { token } = useParams();
  useEffect(() => {
    if(token){
      const sendData = { token: token};
      axios
          .post("http://localhost:8081/verify-email", sendData)
          .then((res) => {
            if(res.status === 200) {
              alert("Account Verified");
              localStorage.setItem("userToken", res.data.token);
              localStorage.setItem('isLoggedIn', true);
              setIsLoggedIn(true);
            }
          })
          .catch((err) => console.log(err));
    }
  }, [token]);
  return (
    <div className="app">
      <header>
        <h1>Follow people to stay updated on the things you care about</h1>
      </header>
      <div className="user-grid">
        {influencers.map((user, index) => (
          <UserCard
            key={index}
            name={user.name}
            description={user.description}
            followers={user.followers}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default App;
