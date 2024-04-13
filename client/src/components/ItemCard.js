import React, { useState, useEffect } from 'react';

const createImagePath = (imagePath) => {
  if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
    return imagePath;
  } else {
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
  const [likes, setLikes] = useState(item.likes || 0);
  const [dislikes, setDislikes] = useState(item.dislikes || 0);
  const favoriteButtonText = isFavorited ? 'Unfavorite' : 'Favorite';

  // Update likes and dislikes when props change
  useEffect(() => {
    setLikes(item.likes || 0);
    setDislikes(item.dislikes || 0);
  }, [item.likes, item.dislikes]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const imagePath = createImagePath(item.image);

  const handleLike = () => {
    onLike(item.id);
    setLikes(likes + 1); // Optimistic update
  };

  const handleDislike = () => {
    onDislike(item.id);
    setDislikes(dislikes + 1); // Optimistic update
  };

  return (
    <>
      <div className="item-card">
        <h3>{item.name}</h3>
        <img src={imagePath} alt={item.name} className="item-image" onClick={toggleModal} />
        <p>{item.description}</p>
        <div className="button-group">
          {canEdit && (
            <button onClick={(e) => { e.stopPropagation(); onEdit(item); }}>Edit</button>
          )}
          {canDelete && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>Delete</button>
          )}
          {typeof isFavorited !== 'undefined' && (
            <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}>
              {favoriteButtonText}
            </button>
          )}
          {onLike && (
            <button onClick={(e) => { e.stopPropagation(); handleLike(); }}>
              Like ({likes})
            </button>
          )}
          {onDislike && (
            <button onClick={(e) => { e.stopPropagation(); handleDislike(); }}>
              Dislike ({dislikes})
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={imagePath} alt={item.name} className="modal-image" />
            <h3 className="modal-title">{item.name}</h3>
            <p className="modal-description">{item.description}</p>
            <p><span className="modal-info-label">Location:</span> {item.location}</p>
            <p><span className="modal-info-label">Condition:</span> {item.condition}</p>
            <p><span className="modal-info-label">Curbside Pickup Time:</span> {new Date(item.time_to_be_set_on_curb).toLocaleString()}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ItemCard;