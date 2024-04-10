import React, { useState } from 'react';

// Helper function to create the correct path for images
const createImagePath = (imagePath) => {
  // Check if imagePath is a URL or a local filename
  if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
    // It's a full URL or an absolute path, return as is
    return imagePath;
  } else {
    // It's a local filename, construct the URL to access it via the backend
    return `http://localhost:5555/uploads/${imagePath}`;
  }
};

const ItemCard = ({
  item,
  canEdit = false,
  canDelete = false,
  isFavorited,
  onEdit,
  onDelete,
  onToggleFavorite,
  onLike,
  onDislike,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const favoriteButtonText = isFavorited ? 'Unfavorite' : 'Favorite';

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Make sure the image path is processed
  const imagePath = createImagePath(item.image);

  console.log('Image Path:', item.image);
  console.log('Constructed URL:', createImagePath(item.image));

  return (
    <>
      <div className="item-card">
        <h3>{item.name}</h3>
        <img src={imagePath} alt={item.name} className="item-image" onClick={toggleModal} />
        <p>{item.description}</p>
        {canEdit && <button onClick={() => onEdit(item)}>Edit</button>}
        {canDelete && <button onClick={() => onDelete(item.id)}>Delete</button>}
        {typeof isFavorited !== 'undefined' && <button onClick={() => onToggleFavorite(item.id)}>{favoriteButtonText}</button>}
        {onLike && <button onClick={() => onLike(item.id)}>Like</button>}
        {onDislike && <button onClick={() => onDislike(item.id)}>Dislike</button>}
      </div>

      {isModalOpen && (
        <div className="modal" onClick={() => setIsModalOpen(false)}>
          <img src={imagePath} alt={item.name} className="modal-image" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
};

export default ItemCard;