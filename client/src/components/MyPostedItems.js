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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingItem(prev => ({ ...prev, [name]: value }));
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
    const formData = new FormData();
    Object.keys(editingItem).forEach(key => {
        // Make sure the key for the image is consistent with the backend
        if (key === 'image' && editingItem[key] instanceof File) {
            formData.append('image', editingItem.image); // Use 'image' instead of 'file'
        } else {
            formData.append(key, editingItem[key]);
        }
    });

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.put(`/items/${editingItem.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(prevItems => prevItems.map(item => item.id === editingItem.id ? { ...item, ...response.data.item } : item));
      setEditingItem(null);
      setImagePreview('');
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item');
    }
  };

  const startEditing = (item) => {
    setEditingItem(item);
    setImagePreview(item.image || ''); // Use the existing image as a fallback
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
          {/* Description Input */}<div className="form-group">
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
          {/* Include inputs for other fields */}
          <div className="form-group">
            {/* Dropzone for image upload */}
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
