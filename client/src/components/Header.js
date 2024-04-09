import React from 'react';
import Navbar from './Navbar';
import '../index.css'; 
import logo from '../assets/Curble-Photoroom.png-Photoroom.png'; 
import { useAuth } from './AuthContext'; // Import useAuth hook from where AuthContext is defined

const Header = () => {
  const { isLoggedIn } = useAuth(); // Access isLoggedIn from AuthContext

  return (
    <header className="header">
      <div className="container">
        <img src={logo} alt="Curble Logo" className="logo" />
        <Navbar isLoggedIn={isLoggedIn} /> {/* Pass isLoggedIn to Navbar */}
      </div>
    </header>
  );
};

export default Header;
