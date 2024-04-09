import React from 'react';
import { NavLink } from 'react-router-dom';
import '../index.css';
import { useAuth } from './AuthContext'; // Import useAuth hook from where AuthContext is defined

const Navbar = () => {
  const { isLoggedIn } = useAuth(); // Access isLoggedIn from AuthContext

  return (
    <nav className="navbar">
      <ul>
        <li><NavLink to="/" exact activeClassName="active">Home</NavLink></li>
        <li><NavLink to="/about" activeClassName="active">About</NavLink></li>
        <li><NavLink to="/browse" activeClassName="active">Browse</NavLink></li>
        {isLoggedIn ? (
          <li><NavLink to="/account" activeClassName="active">Account</NavLink></li>
        ) : (
          <>
            <li><NavLink to="/login" activeClassName="active">Login</NavLink></li>
            <li><NavLink to="/register" activeClassName="active">Register</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;