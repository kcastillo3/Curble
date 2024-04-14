import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import homeImage from '../assets/Curble Home.webp';

const Home = () => {
  let history = useHistory(); // Hook to enable navigation

  useEffect(() => {
    AOS.init({
      duration: 800,  // Animation speed
      easing: 'ease-in-out',  // Smooth and symmetrical easing
      once: true,  // Animation happens once when the element is scrolled into view
      delay: 100,  // Initial delay on the animations
    });
  }, []);

  // Function to navigate to the Browse page
  const navigateToBrowse = () => {
    history.push('/browse');
  };

  return (
    <div className="home-container">
      <h2 className="welcome-message" data-aos="fade-down">Welcome to Curble!</h2>
      {/* Updated to use the imported "Curble Home" image with AOS */}
      <img src={homeImage} alt="Welcome to Curble" className="home-image" data-aos="zoom-in"/>
      <p className="intro-paragraph" data-aos="fade-up" data-aos-delay="200">
        Share with your community!
      </p>
      {/* Button that navigates to the Browse page when clicked, with AOS */}
      <button className="start-here-button" onClick={navigateToBrowse} data-aos="fade-up" data-aos-delay="300">
        START HERE
      </button>
    </div>
  );
};

export default Home;