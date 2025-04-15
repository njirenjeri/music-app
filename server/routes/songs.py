from flask import Blueprint, session, request, jsonify
from extensions import db
from models import Song
import requests

# Create a Blueprint for song routes
songs_bp = Blueprint('songs', __name__)

def song_to_dict(song):
    return {
        "id": song.id,
        "title": song.title,
        "artist": song.artist,
        "filename": song.filename,
        "preview_url": song.preview_url,  
    }

@songs_bp.route('/songs', methods=['GET'])
def get_songs():
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    songs = Song.query.filter_by(user_id=user_id).all()

    if not songs:
        return jsonify({"message": "You have not added any music"}), 200
    
    return jsonify([song.to_dict() for song in songs])

# Route to save a song to the user's library
@songs_bp.route('/songs', methods=['POST'])
def save_song():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.get_json()

    # Create a new song entry linked to current user
    song = Song(
        title = data['title'],
        artist = data['artist'],
        album = data.get('album'),
        source = data['source'],
        preview_url = data.get('preview_url'),
        filename = data.get('filename'),
        user_id = user_id
    )

    db.session.add(song)
    db.session.commit()
    return jsonify(song.to_dict()), 201

# Route to search iTunes for music
@songs_bp.route('/search/itunes')
def search_itunes():
    query = request.args.get('q')
    # send request to itunes search API
    response = requests.get(f'https://itunes.apple.com/search?term={query}&entity=song')
    return jsonify(response.json().get('results', []))
