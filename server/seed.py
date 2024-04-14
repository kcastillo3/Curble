#!/usr/bin/env python3

# Standard library imports
from random import choice as rc
from datetime import datetime

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

def create_items():
    items_data = [
        {
            "user_id": 1,
            "name": "Vintage Armchair",
            "description": "A well-loved and comfortable vintage armchair.",
            "location": "Manhattan, NY",
            "condition": "Good",
            "time_to_be_set_on_curb": datetime(2024, 6, 15, 14, 0, 0),
            "image": "https://images.craigslist.org/00Y0Y_4oqwDoIdEgF_0lM0CI_600x450.jpg"
        },
        {
            "user_id": 2,
            "name": "Antique Desk",
            "description": "An antique wooden desk in excellent condition.",
            "location": "Brooklyn, NY",
            "condition": "Like New",
            "time_to_be_set_on_curb": datetime(2024, 7, 5, 16, 30, 0),
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXjU7log6rx2oS65YMKvngKb1FewJxuVcTDg&s"
        },
        {
            "user_id": 3,
            "name": "Road Bicycle",
            "description": "A fast and durable road bicycle, perfect for city commutes.",
            "location": "Queens, NY",
            "condition": "Fair",
            "time_to_be_set_on_curb": datetime(2024, 8, 20, 18, 45, 0),
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_JjzinGs36RP6mR14wtuNwcImw_GwXylm9w&s"
        },
        {
            "user_id": 4,
            "name": "Bookshelf Collection",
            "description": "A collection of three bookshelves, great for a home library.",
            "location": "Staten Island, NY",
            "condition": "Good",
            "time_to_be_set_on_curb": datetime(2024, 5, 12, 10, 0, 0),
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUuPJCpVrtP6VzZVsrctlpnATwsQTe_yzGYQ&s"
        },
        {
        "user_id": 5,
        "name": "Modern Lamp",
        "description": "Stylish modern lamp, suitable for a bedside table or desk.",
        "location": "Bronx, NY",
        "condition": "New",
        "time_to_be_set_on_curb": datetime(2024, 9, 22, 19, 0, 0),
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmfCXUySsbGVNNFeWVdNw_hNhdqVTjVok-CA&s"
        },
        {
            "user_id": 6,
            "name": "Yoga Mat",
            "description": "Practically new yoga mat, great for fitness enthusiasts.",
            "location": "Harlem, NY",
            "condition": "Like New",
            "time_to_be_set_on_curb": datetime(2024, 10, 3, 17, 30, 0),
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjzzem98oOQoe7mbO4NxSQm0dPsrBJUZNdWA&s"
        },
        {
            "user_id": 7,
            "name": "Kitchen Table Set",
            "description": "A kitchen table with four chairs, perfect for a small apartment.",
            "location": "Lower East Side, NY",
            "condition": "Good",
            "time_to_be_set_on_curb": datetime(2024, 11, 8, 12, 15, 0),
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMWenOoawwK5ZZlvOQ7F3fCrDPIOQ60H5LmQ&s"
        },
        {
            "user_id": 8,
            "name": "Acoustic Guitar",
            "description": "Full-sized acoustic guitar with a rich and warm tone.",
            "location": "Upper West Side, NY",
            "condition": "Fair",
            "time_to_be_set_on_curb": datetime(2024, 12, 17, 13, 0, 0),
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRySxPGNQliM6duoDGLMNAyL9pXkCTvx81SKw&s"
        },
        {
            "user_id": 9,
            "name": "Set of Novels",
            "description": "A collection of classic novels, great for any book lover.",
            "location": "Brooklyn Heights, NY",
            "condition": "Good",
            "time_to_be_set_on_curb": datetime(2024, 6, 30, 14, 0, 0),
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmwa8DyF1A64xQSBWEdAfJxDCu5AgujGrSUw&s"
        },
        {
            "user_id": 10,
            "name": "Children's Bike",
            "description": "A colorful bike suitable for children aged 5-7 years.",
            "location": "Astoria, NY",
            "condition": "Fair",
            "time_to_be_set_on_curb": datetime(2024, 8, 15, 15, 0, 0),
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpV3SqOz7KeIBcjijqn0nDXDmvNZyDN7hXCg&s"
        },
        {
            "user_id": 11,
            "name": "Vintage Vinyl Player",
            "description": "Retro-style vinyl player, perfect working condition.",
            "location": "Greenwich Village, NY",
            "condition": "Good",
            "time_to_be_set_on_curb": datetime(2024, 5, 12, 10, 0, 0),
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnoZrrW9VBLU_1lv7majgFPyMGBRF_OKn0EQ&s"
        },
        {
            "user_id": 12,
            "name": "Office Chair",
            "description": "Comfortable swivel office chair with adjustable height.",
            "location": "Midtown Manhattan, NY",
            "condition": "Like New",
            "time_to_be_set_on_curb": datetime(2024, 7, 21, 9, 30, 0),
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgM86f7IM-rw5H5NiMlznibZ-I8XLakH0sYg&s"
        },
        {
            "user_id": 13,
            "name": "BBQ Grill",
            "description": "Portable BBQ grill, great for parks and outdoor activities.",
            "location": "Williamsburg, NY",
            "condition": "Used",
            "time_to_be_set_on_curb": datetime(2024, 8, 18, 18, 0, 0),
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH67taddQRa_37UQkkHgbtu6uQ2vi1AA-diQ&s"
        },
        {
            "user_id": 14,
            "name": "Plant Collection",
            "description": "Assortment of houseplants, some succulents included.",
            "location": "Park Slope, NY",
            "condition": "Good",
            "time_to_be_set_on_curb": datetime(2024, 3, 15, 12, 0, 0),
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTulXsqHw0E0IPNdr6oSPoRjyaHyqcgFJbhIA&s"
        },
        {
            "user_id": 15,
            "name": "Basketball Hoop",
            "description": "Full-size basketball hoop with stand, adjustable height.",
            "location": "Bushwick, NY",
            "condition": "Good",
            "time_to_be_set_on_curb": datetime(2024, 4, 20, 16, 0, 0),
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgxy8DPRgh70pLNy3QcYrZvivn-jAprnj5rw&s"
        },
        {
            "user_id": 16,
            "name": "Set of Ceramic Mugs",
            "description": "Four handcrafted ceramic mugs in various colors.",
            "location": "Chelsea, NY",
            "condition": "Like New",
            "time_to_be_set_on_curb": datetime(2024, 5, 27, 11, 45, 0),
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRHYDK4CKnwHQULMlrngoqBio-hsAanJpXag&s"
        }
        ]
    
    for item_data in items_data:
        item = Item(
            user_id=item_data["user_id"],
            name=item_data["name"],
            description=item_data["description"],
            location=item_data["location"],
            condition=item_data["condition"],
            time_to_be_set_on_curb=item_data["time_to_be_set_on_curb"],
            image=item_data["image"]
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

        # Seed Items (no arguments needed)
        create_items()  # Corrected call here
        items = Item.query.all()

        # Seed Favorites
        create_favorites(100, users, items)

        # Seed Feedback
        create_feedback(200, users, items)

        print("Database seeded successfully!")
