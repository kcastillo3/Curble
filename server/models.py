from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from config import db
from sqlalchemy_serializer import SerializerMixin
import datetime

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False, unique=True)
    username = Column(String(100), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    items = relationship('Item', back_populates='user')
    favorites = relationship('Favorites', back_populates='user')
    feedback_given = relationship('UserFeedback', back_populates='user')

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', username='{self.username}')>"

class Item(db.Model, SerializerMixin):
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(255), nullable=False)
    condition = Column(String(100), nullable=False)
    time_to_be_set_on_curb = Column(DateTime)
    image_url = Column(String(255))
    user = relationship('User', back_populates='items')
    favorited_by = relationship('Favorites', back_populates='item')
    feedback = relationship('UserFeedback', back_populates='item')

    def __repr__(self):
        return f"<Item(id={self.id}, name='{self.name}')>"

class Favorites(db.Model, SerializerMixin):
    __tablename__ = 'favorites'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    item_id = Column(Integer, ForeignKey('items.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship('User', back_populates='favorites')
    item = relationship('Item', back_populates='favorited_by')

    def __repr__(self):
        return f"<Favorites(id={self.id}, user_id={self.user_id}, item_id={self.item_id})>"

class UserFeedback(db.Model, SerializerMixin):
    __tablename__ = 'user_feedback'

    id = Column(Integer, primary_key=True, autoincrement=True)
    item_id = Column(Integer, ForeignKey('items.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    feedback_type = Column(Enum('LIKE', 'DISLIKE'), nullable=False)
    user = relationship('User', back_populates='feedback_given')
    item = relationship('Item', back_populates='feedback')

    def __repr__(self):
        return f"<UserFeedback(id={self.id}, feedback_type='{self.feedback_type}')>"