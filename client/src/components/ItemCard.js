import React, { useState } from 'react';

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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div className="item-card">
        <h3>{item.name}</h3>
        <img
          src={item.image}
          alt={item.name}
          className="item-image"
          onClick={toggleModal}
        />
        <p>{item.description}</p>
        {/* Conditional rendering based on permissions and functionalities */}
        {canEdit && <button onClick={() => onEdit(item.id)}>Edit</button>}
        {canDelete && <button onClick={() => onDelete(item.id)}>Delete</button>}
        {typeof isFavorited !== 'undefined' && (
          <button onClick={() => onToggleFavorite(item.id)}>
            {favoriteButtonText}
          </button>
        )}
        {onLike && <button onClick={() => onLike(item.id)}>Like</button>}
        {onDislike && <button onClick={() => onDislike(item.id)}>Dislike</button>}
      </div>

      {isModalOpen && (
        <div className="modal" onClick={toggleModal}>
          <img
            src={item.image}
            alt={item.name}
            className="modal-image"
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking on the image
          />
        </div>
      )}
    </>
  );
};

export default ItemCard;