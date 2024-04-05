#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Item, Favorites, UserFeedback

fake = Faker()

def create_users(n):
    for _ in range(n):
        user = User(
            email=fake.email(),
            username=fake.user_name(),
            password_hash=fake.md5(raw_output=False)  # Note: Use proper password hashing in actual app
        )
        db.session.add(user)
    db.session.commit()

def create_items(n, users):
    conditions = ['New', 'Like New', 'Good', 'Fair', 'Needs Repair']
    for _ in range(n):
        item = Item(
            user_id=rc(users).id,
            name=fake.word().capitalize(),
            description=fake.text(),
            location=fake.address(),
            condition=rc(conditions),
            time_to_be_set_on_curb=fake.date_time_this_year(),
            image=fake.image_url()  # Corrected to image
        )
        db.session.add(item)
    db.session.commit()

def create_favorites(n, users, items):
    for _ in range(n):
        favorite = Favorites(
            user_id=rc(users).id,
            item_id=rc(items).id
        )
        db.session.add(favorite)
    db.session.commit()

def create_feedback(n, users, items):
    feedback_types = ['LIKE', 'DISLIKE']
    for _ in range(n):
        feedback = UserFeedback(
            item_id=rc(items).id,
            user_id=rc(users).id,
            feedback_type=rc(feedback_types)
        )
        db.session.add(feedback)
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")

        # Clear existing data
        UserFeedback.query.delete()
        Favorites.query.delete()
        Item.query.delete()
        User.query.delete()

        # Seed Users
        create_users(10)
        users = User.query.all()

        # Seed Items
        create_items(50, users)
        items = Item.query.all()

        # Seed Favorites
        create_favorites(100, users, items)

        # Seed Feedback
        create_feedback(200, users, items)

        print("Database seeded successfully!")
