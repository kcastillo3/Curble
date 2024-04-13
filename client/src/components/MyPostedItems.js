import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from './ItemCard';
import { useDropzone } from 'react-dropzone';

const MyPostedItems = ({ userId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isImageUpdated, setIsImageUpdated] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setEditingItem(prev => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
        setIsImageUpdated(true); // Mark image as updated
      }
    },
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('/items', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch items. Please try again.');
        setLoading(false);
      }
    };
    fetchItems();
  }, [userId]);

  const formatDateForBackend = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    let month = date.getMonth() + 1; // getMonth() returns month from 0-11
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds(); // Get seconds component

    // Ensuring two digits for month, day, hours, minutes, and seconds
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // Use space and include seconds
};

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === 'time_to_be_set_on_curb') {
    const formattedDate = formatDateForBackend(value);
    setEditingItem(prev => ({ ...prev, [name]: formattedDate }));
  } else if (name === 'address' || name === 'borough') {
    // Ensure both borough and address are updated correctly
    setEditingItem(prev => ({
      ...prev,
      [name]: value,  // Directly update the name with the value
      location: name === 'address'
        ? `${prev.borough || ''}, ${value}`
        : `${value}, ${prev.address || ''}`
    }));
  } else {
    setEditingItem(prev => ({ ...prev, [name]: value }));
  }
};

  const handleDelete = async (itemId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('access_token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  
    try {
      let response;
      if (isImageUpdated) {
        // Handling full update (including image) with PUT
        const formData = new FormData();
        Object.keys(editingItem).forEach(key => {
          if (key === 'image' && editingItem[key] instanceof File) {
            formData.append('image', editingItem.image);
          } else {
            formData.append(key, editingItem[key]);
          }
        });
  
        response = await axios.put(`/items/${editingItem.id}`, formData, {
          headers: { 'Authorization': `Bearer ${token}` }, // Content-Type for multipart/form-data is set automatically
        });
      } else {
        // Handling partial update without image using PATCH
        const dataToSend = { ...editingItem };
        delete dataToSend.image; // Ensure image is not included in PATCH request
        
        console.log("Sending PATCH data:", JSON.stringify(dataToSend));
        response = await axios.patch(`/items/${editingItem.id}`, JSON.stringify(dataToSend), { headers });
      }
  
      // Update UI based on response
      setItems(prevItems => prevItems.map(item => item.id === editingItem.id ? { ...item, ...response.data.item } : item));
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item');
    } finally {
      // Reset states after update attempt
      setEditingItem(null);
      setImagePreview('');
      setIsImageUpdated(false);
    }
  };

  const startEditing = (item) => {
    // Assume location is in the format "Borough, Address"
    const locationParts = item.location ? item.location.split(', ') : ['', ''];
    const [borough, address] = locationParts.length > 1 ? locationParts : [item.location, ''];

    setEditingItem({
        ...item,
        borough, // Set borough separately
        address  // Set address separately
    });
    setImagePreview(item.image || ''); // Use the existing image as a fallback
    setIsImageUpdated(false); // Reset image updated state
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="browse-container">
      <h2>My Posted Items</h2>
      {editingItem && (
        <form onSubmit={handleUpdate} className="edit-item-form">

          {/* Name */}
          <div className="form-group">
            <label htmlFor="name" className="name-label">Name:</label>
            <input
              name="name"
              value={editingItem.name}
              onChange={handleChange}
              className="form-control name-input"
              placeholder="Enter the item name"
            />
          </div>

          {/* Description Input */}
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              name="description"
              placeholder="Description"
              value={editingItem.description || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Borough Selection */}
          <div className="form-group">
              <label htmlFor="borough">Borough:</label>
              <select
                  name="borough"
                  value={editingItem.borough || ''}
                  onChange={handleChange}
                  className="form-control"
              >
                  <option value="">Select Borough</option>
                  <option value="Manhattan">Manhattan</option>
                  <option value="Brooklyn">Brooklyn</option>
                  <option value="Queens">Queens</option>
                  <option value="Bronx">Bronx</option>
                  <option value="Staten Island">Staten Island</option>
              </select>
          </div>
  
          {/* Address Input */}
          <div className="form-group">
              <label htmlFor="address">Address:</label>
              <input
                  name="address"
                  type="text"
                  placeholder="Address (e.g., 123 Main St)"
                  value={editingItem.address || ''}
                  onChange={handleChange}
                  className="form-control"
              />
          </div>
  
          {/* Condition Dropdown */}
          <div className="form-group">
            <label htmlFor="condition">Condition:</label>
            <select
              name="condition"
              value={editingItem.condition || ''}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select Condition</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
  
          {/* Time to Be Set on Curb */}
          <div className="form-group">
            <label htmlFor="time_to_be_set_on_curb">Time to Be Set on Curb:</label>
            <input
              name="time_to_be_set_on_curb"
              type="datetime-local"
              value={editingItem.time_to_be_set_on_curb || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Dropzone for image upload */}
          <div className="form-group">
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <button type="button" className="upload-image-button">Upload Image</button>
              {imagePreview && (
              <img src={imagePreview} alt="Preview" className="image-preview" />
              )}
          </div>
        </div>
          <button type="submit" className="save-changes-button">Save Changes</button>
          <button type="button" onClick={() => setEditingItem(null)} className="cancel-button">Cancel</button>
        </form>
      )}
      
      <div className="browse-items-container">
        {items.length > 0 ? (
          items.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              canEdit={true}
              canDelete={true}
              onEdit={() => startEditing(item)}
              onDelete={() => handleDelete(item.id)}
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
