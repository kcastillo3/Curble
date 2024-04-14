import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from './ItemCard';

const Favorites = () => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteItems = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('You must be logged in to view favorites.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Assuming the response data is directly the list of favorite items
        setFavoriteItems(response.data);
      } catch (error) {
        setError('Failed to fetch favorites. Please try again later.');
        console.error('Error fetching favorite items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteItems();
  }, []);

  const handleUnfavorite = async (itemId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`/favorites/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newFavorites = favoriteItems.filter(item => item.id !== itemId);
      setFavoriteItems(newFavorites);
      localStorage.setItem('favoritedItems', JSON.stringify(newFavorites.map(item => item.id)));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  if (loading) {
    return <div>Loading your favorites...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="browse-container"> {/* Use the same container class for consistent styling */}
      <h2>My Favorites</h2>
      <div className="browse-items-container"> {/* Apply the 4x4 grid layout */}
        {favoriteItems.length > 0 ? (
          favoriteItems.map(item => (
            <ItemCard 
              key={item.id}
              item={item}
              isFavorited={true}
              onToggleFavorite={() => handleUnfavorite(item.id)}
              // I may want to include or exclude other actions like editing or deleting
            />
          ))
        ) : (
          <p>You have not added any items to your favorites yet.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;