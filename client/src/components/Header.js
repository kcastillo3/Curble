import React from 'react';
import Navbar from './Navbar';
import '../index.css'; // Ensure this is the correct path to your CSS file
import logo from '../assets/Curble.webp'; // Adjust the path based on your project structure

const Header = ({ isLoggedIn, onLogout }) => {
  return (
    <header className="header">
      <div className="container">
        {/* Updated to use the imported logo */}
        <img src={logo} alt="Curble Logo" className="logo" />
        <div className="navbar-wrapper">
          {/* Navbar is rendered with isLoggedIn and onLogout props */}
          <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />
        </div>
      </div>
      {/* Placeholder for any additional header content */}
    </header>
  );
};

export default Header;
