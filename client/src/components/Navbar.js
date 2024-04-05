import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Navbar = ({ isLoggedIn, onLogout }) => {
  return (
    <header className='header'>
      <nav className="navbar">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/browse">Browse</Link></li>
          {isLoggedIn ? (
            <>
              {/* When logged in, show link to Account and Logout option */}
              <li><Link to="/account">Account</Link></li>
              <li><button onClick={onLogout} style={{background: 'none', border: 'none', color: 'inherit', padding: 0, font: 'inherit', cursor: 'pointer', outline: 'inherit'}}>Logout</button></li>
            </>
          ) : (
            // When not logged in, show Login and Sign Up options
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar;