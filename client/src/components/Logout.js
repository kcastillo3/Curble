import React from 'react';
import { useHistory } from 'react-router-dom';

const Logout = ({ onLogout }) => {
  const history = useHistory();

  const handleLogout = () => {
    // Confirm logout action
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      onLogout(); // Perform logout logic from parent component
      history.push('/login'); // Redirect to login page after logout
    }
  };

  return (
    <div className="logout-container">
      <h2>Want to Logout?</h2>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default Logout;