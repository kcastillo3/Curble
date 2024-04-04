from flask import Flask, request, jsonify, current_app, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
import os
from config import app, db
from models import User, Item, Favorites, UserFeedback

# Initialize Flask-JWT-Extended
jwt = JWTManager(app)

# Ensure the UPLOAD_FOLDER exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Helper function for user authentication
def authenticate_user(email, password):
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password_hash, password):
        return user
    return None

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already registered"}), 400
    new_user = User(email=data['email'], username=data['username'],
                    password_hash=generate_password_hash(data['password']))
    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(identity=new_user.id)
    return jsonify({"message": "Registration successful", "user_id": new_user.id, "access_token": access_token}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = authenticate_user(data['email'], data['password'])
    if not user:
        return jsonify({"message": "Invalid credentials"}), 401
    access_token = create_access_token(identity=user.id)
    return jsonify({"message": "Login successful", "access_token": access_token}), 200

@app.route('/items', methods=['POST', 'GET'])
@jwt_required(optional=True)
def items():
    if request.method == 'POST':
        if not get_jwt_identity():
            return jsonify({"message": "Unauthorized"}), 401
        if 'file' not in request.files:
            return jsonify({"message": "No file part"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"message": "No selected file"}), 400
        filename = secure_filename(file.filename)
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        data = request.form
        new_item = Item(name=data['name'], description=data['description'],
                        location=data['location'], condition=data['condition'],
                        user_id=get_jwt_identity(),
                        time_to_be_set_on_curb=datetime.strptime(data['time_to_be_set_on_curb'], '%Y-%m-%dT%H:%M:%S'),
                        image_url=file_path)
        db.session.add(new_item)
        db.session.commit()
        return jsonify({"message": "Item posted successfully", "item_id": new_item.id}), 201
    else:
        items = Item.query.all()
        return jsonify([item.to_dict() for item in items]), 200

@app.route('/favorites', methods=['POST', 'DELETE'])
@jwt_required()
def manage_favorites():
    user_id = get_jwt_identity()
    data = request.json
    if request.method == 'POST':
        new_favorite = Favorites(user_id=user_id, item_id=data['item_id'])
        db.session.add(new_favorite)
        db.session.commit()
        return jsonify({"message": "Item added to favorites"}), 201
    elif request.method == 'DELETE':
        favorite = Favorites.query.filter_by(user_id=user_id, item_id=data['item_id']).first()
        if favorite:
            db.session.delete(favorite)
            db.session.commit()
            return jsonify({"message": "Item removed from favorites"}), 204
        return jsonify({"message": "Item not found in favorites"}), 404

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)