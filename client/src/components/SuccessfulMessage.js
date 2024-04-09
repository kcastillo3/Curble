import React from 'react';
import { useHistory } from 'react-router-dom';
import handsImage from '../assets/hands.png';

const SuccessfulMessage = () => {
  const history = useHistory();

  const handleRedirect = () => {
    history.push('/browse'); // To my '/browse'route
  };

  return (
    <div className="successful-message-container">
      <h2>Successfully Logged In!</h2>
      <p>Check out posted items!</p>
      <img src={handsImage} alt="Celebratory Hands" className="celebratory-hands-image" />
      <button onClick={handleRedirect} className="view-items-button">
        View Posted Items
      </button>
    </div>
  );
};

export default SuccessfulMessage;