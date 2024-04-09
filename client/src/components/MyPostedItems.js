import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from './ItemCard';

const MyPostedItems = ({ userId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const token = localStorage.getItem('access_token'); // Confirm this is the correct key
      if (!token) {
        setError('Authentication error. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/items`, { // If my API supports fetching items by user, adjust the URL accordingly
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
        // Differentiate error based on response status
        setError(error.response && error.response.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to fetch items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [userId]); // Depend on userId to refetch items when it changes

  const handleDelete = async (itemId) => {
    const token = localStorage.getItem('access_token'); // Confirm this is the correct key
    if (!token) {
      setError('Authentication error. Please log in again.');
      return;
    }

    try {
      await axios.delete(`/items/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(currentItems => currentItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item');
    }
  };

  const handleUpdate = async (itemId, updatedItem) => {
    const token = localStorage.getItem('access_token'); // Confirm this is the correct key
    if (!token) {
      setError('Authentication error. Please log in again.');
      return;
    }

    try {
      await axios.put(`/items/${itemId}`, updatedItem, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(currentItems => currentItems.map(item => item.id === itemId ? { ...item, ...updatedItem } : item));
    } catch (error) {
      console.error('Error updating item:', error);
      setError('Failed to update item');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="browse-container"> {/* Reuse the container class for consistent styling */}
      <h2>My Posted Items</h2>
      <div className="browse-items-container"> {/* This ensures the 4x4 grid layout */}
        {items.length > 0 ? (
          items.map(item => (
            <ItemCard 
              key={item.id}
              item={item}
              canEdit={true}
              canDelete={true}
              onEdit={() => {/* invoke edit modal or form with item.id */}}
              onDelete={() => handleDelete(item.id)}
              // Omitting like, dislike, and favorite for MyPostedItems as needed
            />
          ))
        ) : (
          <p>You have not posted any items yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyPostedItems;

