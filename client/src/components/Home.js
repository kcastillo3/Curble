import React from 'react';
import { useHistory } from 'react-router-dom';
import homeImage from '../assets/Curble Home.webp'; 

const Home = () => {
  let history = useHistory(); // Hook to enable navigation

  // Function to navigate to the Browse page
  const navigateToBrowse = () => {
    history.push('/browse');
  };

  return (
    <div className="home-container">
      <h2 className="welcome-message">Welcome to Curble!</h2>
      {/* Updated to use the imported "Curble Home" image */}
      <img src={homeImage} alt="Welcome to Curble" className="home-image" />
      <p className="intro-paragraph">Share with your community!</p>
      {/* Button that navigates to the Browse page when clicked */}
      <button className="start-here-button" onClick={navigateToBrowse}>
        START HERE
      </button>
    </div>
  );
};

export default Home;