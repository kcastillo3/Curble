import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Ensure this path is correct
import PostItemForm from './PostItemForm';
import MyPostedItems from './MyPostedItems';
import Favorites from './Favorites';

const Account = () => {
  const [openSections, setOpenSections] = useState({});  
  const [postedItems, setPostedItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');
  const { isLoggedIn, logout } = useAuth(); // Using the useAuth hook to access auth state and logout function
  const toggleSection = (section) => {
    setOpenSections(prevOpenSections => ({
      ...prevOpenSections,
      [section]: !prevOpenSections[section]
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        try {
          const postedItemsResponse = await axios.get('/items', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          });
          setPostedItems(postedItemsResponse.data);
        } catch (err) {
          console.error('Failed to fetch posted items:', err);
          setError('Failed to fetch posted items.');
        }

        try {
          const favoritesResponse = await axios.get('/favorites', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          });
          setFavorites(favoritesResponse.data);
        } catch (err) {
          console.error('Failed to fetch favorites:', err);
          setError('Failed to fetch favorites.');
        }
      }
    };

    fetchData();
  }, [isLoggedIn]); // Dependency on isLoggedIn to ensure fetching happens after login

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="account-container">
      <h2>Your Dashboard</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="accordion-section">
        <button className="accordion" onClick={() => toggleSection('postItem')}>
          Post An Item
        </button>
        {openSections['postItem'] && <PostItemForm />}
      </div>
      
      <div className="accordion-section">
        <button className="accordion" onClick={() => toggleSection('postedItems')}>
          My Posted Items
        </button>
        {openSections['postedItems'] && <MyPostedItems items={postedItems} />}
      </div>
      
      <div className="accordion-section">
        <button className="accordion" onClick={() => toggleSection('favorites')}>
          Favorites
        </button>
        {openSections['favorites'] && <Favorites items={favorites} />}
      </div>
      
      <button onClick={logout} className="logout-button">Logout</button>
    </div>
  );
};

export default Account;
