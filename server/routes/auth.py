from flask import Blueprint, request, session, jsonify
from models import User, db

# Create a bluprint for auth routes
auth_bp = Blueprint('auth', __name__)


# Route to register new user
@auth_bp.route('/sign_up', methods=['POST'])
def sign_up():
    data = request.get_json()
    # check if email exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already in use"}), 409 #conflict error
    
    # Create new user and hash password
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    # Log user in by saving ID to session
    session['user_id'] = user.id
    return jsonify({"message": "Registered and logged in", 'user': user.to_dict()}), 201

# Route to login an existing user
@auth_bp.route('/sign_in', methods=['POST'])
def sign_in():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    # check credentials and store user ID to session
    if user and user.check_password(data['password']):
        session['user_id'] = user.id
        return jsonify({"message": "Logged in", "user": user.to_dict()})
    return jsonify({"error": "Invalid credentials"}), 401

# Route to logout current user
@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logged Out"})