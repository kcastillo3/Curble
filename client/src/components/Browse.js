import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from './ItemCard';

const Browse = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoritedItems, setFavoritedItems] = useState([]);

  useEffect(() => {
    const fetchItemsAndFavorites = async () => {
      setIsLoading(true);
      try {
        const itemsResponse = await axios.get('/items');
        setItems(itemsResponse.data);

        const token = localStorage.getItem('access_token');
        if (token) {
          const favoritesResponse = await axios.get('/favorites', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFavoritedItems(favoritesResponse.data.map(item => item.item_id)); // Check favorites endpoint returns items with 'item_id'
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemsAndFavorites();
  }, []);

  const handleLike = async (itemId) => {
    try {
      await axios.post(`/feedback`, {
        item_id: itemId,
        feedback_type: 'LIKE',
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      console.log('Liked item successfully');
    } catch (error) {
      console.error('Error liking item:', error);
    }
  };

  const handleDislike = async (itemId) => {
    try {
      await axios.post(`/feedback`, {
        item_id: itemId,
        feedback_type: 'DISLIKE',
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      console.log('Disliked item successfully');
    } catch (error) {
      console.error('Error disliking item:', error);
    }
  };

  const handleToggleFavorite = async (itemId) => {
    const isFavorited = favoritedItems.includes(itemId);
    const endpoint = isFavorited ? `/favorites/${itemId}` : `/favorites`;
    const method = isFavorited ? 'delete' : 'post';
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    };
    const data = isFavorited ? {} : { item_id: itemId };

    try {
      const response = isFavorited ? 
        await axios.delete(endpoint, config) : 
        await axios.post(endpoint, data, config);

      if (response.status === 200 || response.status === 201) {
        setFavoritedItems(current => 
          isFavorited ? 
          current.filter(id => id !== itemId) : 
          [...current, itemId]);
      }
    } catch (error) {
      console.error(isFavorited ? 'Error removing from favorites' : 'Error adding to favorites', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="browse-container">
      <h2>Browse Items</h2>
      <div className="browse-items-container"> {/* This div should have the grid styling */}
        {isLoading ? (
          <div>Loading...</div>
        ) : items.length > 0 ? (
          items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isFavorited={favoritedItems.includes(item.id)}
              onToggleFavorite={() => handleToggleFavorite(item.id)}
              onLike={() => handleLike(item.id)}
              onDislike={() => handleDislike(item.id)}
            />
          ))
        ) : (
          <p>No items found.</p>
        )}
      </div>
    </div>
  );
};

export default Browse;