import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from './ItemCard';

const Browse = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoritedItems, setFavoritedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchItemsAndFavorites = async () => {
      setIsLoading(true);
      const savedFavorites = JSON.parse(localStorage.getItem('favoritedItems')) || [];

      try {
        const itemsResponse = await axios.get('/items');
        setItems(itemsResponse.data);
  
        const token = localStorage.getItem('access_token');
        if (token) {
          const favoritesResponse = await axios.get('/favorites', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const favoritesIds = favoritesResponse.data.map(f => f.item_id);
          const combinedFavorites = Array.from(new Set([...savedFavorites, ...favoritesIds]));
          setFavoritedItems(combinedFavorites);
        } else {
          setFavoritedItems(savedFavorites);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchItemsAndFavorites();
  }, []);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

useEffect(() => {
  const loadFavoritesFromStorage = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('favoritedItems')) || [];
    setFavoritedItems(savedFavorites);
  };

  loadFavoritesFromStorage();

  // Optional: Setup an event listener for local storage changes if multiple tabs are a concern
  window.addEventListener('storage', loadFavoritesFromStorage);

  return () => {
    window.removeEventListener('storage', loadFavoritesFromStorage);
  };
}, []);

const handleLike = async (itemId) => {
  try {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return { ...item, likes: item.likes ? item.likes + 1 : 1 }; // assuming 'likes' key exists
      }
      return item;
    });
    setItems(updatedItems);
    await axios.post(`/feedback`, {
      item_id: itemId,
      feedback_type: 'LIKE',
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    });
    console.log('Liked item successfully');
  } catch (error) {
    console.error('Error liking item:', error);
    // Optionally, revert back the optimistic update in case of failure
  }
};

const handleDislike = async (itemId) => {
  try {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return { ...item, dislikes: item.dislikes ? item.dislikes + 1 : 1 }; // assuming 'dislikes' key exists
      }
      return item;
    });
    setItems(updatedItems);
    await axios.post(`/feedback`, {
      item_id: itemId,
      feedback_type: 'DISLIKE',
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    });
    console.log('Disliked item successfully');
  } catch (error) {
    console.error('Error disliking item:', error);
    // Optionally, revert back the optimistic update in case of failure
  }
};

const handleToggleFavorite = async (itemId) => {
  const isFavorited = favoritedItems.includes(itemId);
  const endpoint = isFavorited ? `/favorites/${itemId}` : `/favorites`;
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
  };
  const data = isFavorited ? {} : { item_id: itemId };

  try {
    const response = isFavorited
      ? await axios.delete(endpoint, config)
      : await axios.post(endpoint, data, config);

    if (response.status === 200 || response.status === 201) {
      const updatedFavorites = isFavorited
        ? favoritedItems.filter(id => id !== itemId)
        : [...favoritedItems, itemId];
      
      setFavoritedItems(updatedFavorites);

      // Update localStorage
      localStorage.setItem('favoritedItems', JSON.stringify(updatedFavorites));
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
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      <div className="browse-items-container"> {/* This div should have the grid styling */}
        {isLoading ? (
          <div>Loading...</div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
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