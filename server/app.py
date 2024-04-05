from flask import request, jsonify, current_app, send_from_directory, abort
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
import os
from config import app, db, UPLOAD_FOLDER
from models import User, Item, Favorites, UserFeedback

# Helper function for user authentication
def authenticate_user(email, password):
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password_hash, password):
        return user
    return None

# New configurations for file uploads
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already registered"}), 400
    new_user = User(email=data['email'], username=data['username'],
                    password_hash=generate_password_hash(data['password']))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Registration successful", "user_id": new_user.id}), 201

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
        if 'image' not in request.files:
            return jsonify({"message": "No file part"}), 400
        file = request.files['image']
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
                        image=file_path)  # Make sure this matches my database column for the image
        db.session.add(new_item)
        db.session.commit()
        return jsonify({"message": "Item posted successfully", "item_id": new_item.id}), 201
    else:
        items = Item.query.all()
        return jsonify([item.to_dict() for item in items]), 200  # Ensure my Item model has a to_dict method

@app.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    user_id = get_jwt_identity()
    data = request.json
    new_favorite = Favorites(user_id=user_id, item_id=data['item_id'])
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify({"message": "Item added to favorites"}), 201

@app.route('/auth/user', methods=['GET'])
@jwt_required()
def get_current_user_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify({
        "id": user.id,
        "email": user.email,
        "username": user.username
    }), 200

@app.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_profile(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({
        "id": user.id,
        "email": user.email,
        "username": user.username
    }), 200

# @app.route('/users/<int:user_id>', methods=['PUT'])
# @jwt_required()
# def update_user_profile(user_id):
#     user = User.query.get_or_404(user_id)
#     current_user_id = get_jwt_identity()
#     if user_id != current_user_id:
#         return jsonify({"message": "Unauthorized"}), 403
#     data = request.json
#     user.email = data.get('email', user.email)
#     user.username = data.get('username', user.username)
#     # Update password if provided
#     if data.get('password'):
#         user.password_hash = generate_password_hash(data['password'])
#     db.session.commit()
#     return jsonify({"message": "User profile updated successfully"}), 200

# @app.route('/users/<int:user_id>', methods=['DELETE'])
# @jwt_required()
# def delete_user_account(user_id):
#     user = User.query.get_or_404(user_id)
#     current_user_id = get_jwt_identity()
#     if user_id != current_user_id:
#         return jsonify({"message": "Unauthorized"}), 403
#     db.session.delete(user)
#     db.session.commit()
#     return jsonify({"message": "User account deleted successfully"}), 200

@app.route('/items/<int:item_id>', methods=['GET'])
@jwt_required(optional=True)
def get_item(item_id):
    item = Item.query.get_or_404(item_id)
    return jsonify(item.to_dict()), 200  # Ensure my Item model has a to_dict method

@app.route('/items/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_item(item_id):
    item = Item.query.get_or_404(item_id)
    if item.user_id != get_jwt_identity():
        return jsonify({"message": "Unauthorized"}), 403
    data = request.form
    if 'file' in request.files:
        file = request.files['file']
        filename = secure_filename(file.filename)
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        item.image_url = file_path
    item.name = data.get('name', item.name)
    item.description = data.get('description', item.description)
    item.location = data.get('location', item.location)
    item.condition = data.get('condition', item.condition)
    if data.get('time_to_be_set_on_curb'):
        item.time_to_be_set_on_curb = datetime.strptime(data['time_to_be_set_on_curb'], '%Y-%m-%dT%H:%M:%S')
    db.session.commit()
    return jsonify({"message": "Item updated successfully", "item_id": item.id}), 200

@app.route('/items/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_item(item_id):
    item = Item.query.get_or_404(item_id)
    if item.user_id != get_jwt_identity():
        return jsonify({"message": "Unauthorized"}), 403
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item deleted successfully"}), 200

@app.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    favorites = Favorites.query.filter_by(user_id=user_id).all()
    favorite_items = [favorite.item.to_dict() for favorite in favorites]  # Ensure my models have a to_dict method
    return jsonify(favorite_items), 200

@app.route('/favorites/<int:item_id>', methods=['POST'])
@jwt_required()
def add_to_favorites(item_id):
    user_id = get_jwt_identity()
    if Favorites.query.filter_by(user_id=user_id, item_id=item_id).first():
        return jsonify({"message": "Item already in favorites"}), 409
    favorite = Favorites(user_id=user_id, item_id=item_id)
    db.session.add(favorite)
    db.session.commit()
    return jsonify({"message": "Item added to favorites"}), 201

@app.route('/favorites/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_favorites(item_id):
    user_id = get_jwt_identity()
    favorite = Favorites.query.filter_by(user_id=user_id, item_id=item_id).first()
    if not favorite:
        return jsonify({"message": "Item not found in favorites"}), 404
    db.session.delete(favorite)
    db.session.commit()
    return jsonify({"message": "Item removed from favorites"}), 200

@app.route('/feedback', methods=['POST'])
@jwt_required()
def submit_feedback():
    user_id = get_jwt_identity()
    data = request.json
    feedback_type = data.get('feedback_type')

    # Validate feedback_type
    if feedback_type not in ['LIKE', 'DISLIKE']:
        return jsonify({"message": "Invalid feedback type. Only 'LIKE' or 'DISLIKE' are accepted."}), 400

    # Proceed if feedback_type is valid
    feedback = UserFeedback(
        item_id=data['item_id'],
        user_id=user_id,
        feedback_type=feedback_type  # 'LIKE' or 'DISLIKE'
    )
    db.session.add(feedback)
    db.session.commit()

    # Return the feedback ID along with the success message
    return jsonify({"message": "Feedback submitted successfully", "feedback_id": feedback.id}), 201

@app.route('/items/<int:item_id>/feedback', methods=['GET'])
def get_feedback(item_id):
    feedbacks = UserFeedback.query.filter_by(item_id=item_id).all()
    feedback_data = [{"user_id": feedback.user_id, "feedback_type": feedback.feedback_type} for feedback in feedbacks]
    return jsonify(feedback_data), 200

@app.route('/feedback/<int:feedback_id>', methods=['DELETE'])
@jwt_required()
def delete_feedback(feedback_id):
    feedback = UserFeedback.query.get_or_404(feedback_id)
    if feedback.user_id != get_jwt_identity():
        return jsonify({"message": "Unauthorized"}), 403
    db.session.delete(feedback)
    db.session.commit()
    return jsonify({"message": "Feedback deleted successfully"}), 200

# Serving uploaded files 
@app.route('/upload', methods=['POST'])
@jwt_required()  
def upload_file():
    # New file upload handling code
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
    file = request.files['file']
    filename = secure_filename(file.filename)
    if filename == '':
        return jsonify({"message": "No selected file"}), 400
    if file and allowed_file(filename):
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return jsonify({"message": "File uploaded successfully", "filepath": file_path}), 201
    else:
        return jsonify({"message": "File type not allowed"}), 400

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS   

if __name__ == '__main__':
    app.run(debug=True, port=5555)

