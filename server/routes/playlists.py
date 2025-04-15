from flask import Blueprint, request, jsonify, session
from extensions import db
from models import Playlist, Song


# create a blueprint for Playlist routes
playlists_bp = Blueprint('playlists', __name__)



# create playlist and add song route
@playlists_bp.route('/playlists', methods=['POST'])
def create_playlist():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({"error": "Playlist name required"}), 400

    # Check if playlist name already exists for the user
    existing_playlist = Playlist.query.filter_by(name=name, user_id=user_id).first()
    if existing_playlist:
        return jsonify({"error": "Playlist name already taken"}), 409

    new_playlist = Playlist(name=name, user_id=user_id)
    db.session.add(new_playlist)
    db.session.commit()

    return jsonify(new_playlist.to_dict()), 201


# Get all playlists created by a logged-in user
@playlists_bp.route('/playlists', methods=['GET'])
def get_user_playlists():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    playlists = Playlist.query.filter_by(user_id=user_id).all()
    return jsonify([p.to_dict() for p in playlists])



# Get all songs in a specific playlist
@playlists_bp.route('/playlists/<int:playlist_id>/songs', methods=['GET'])
def get_playlist_songs(playlist_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    playlist = Playlist.query.get_or_404(playlist_id)
    if playlist.user_id != user_id:
        return jsonify({"error": "Forbidden"}), 403
    
    return jsonify([s.to_dict() for s in playlist.songs])

# add song to a specific playlist
@playlists_bp.route('/playlists/<int:playlist_id>/add_song', methods=['POST'])
def add_song_to_playlist(playlist_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    # fetch the playlists of a logged in user
    playlist = Playlist.query.filter_by(id=playlist_id, user_id=user_id).first()
    if not playlist:
        return jsonify({"error": "Playlist Not Found"}), 404
    

    # get a song id from the request data
    data = request.get_json() #contains song_id from the frontend, not a user input
    song_id = data.get('song_id')
    song = Song.query.filter_by(id=song_id, user_id=user_id).first()
    if not song:
        return jsonify({"error": "Song Not found"}), 404
    
    if song in playlist.songs:
        return jsonify({"error": "Song already in playlist"}), 200
    # playlist = Playlist.query.get_or_404(playlist_id)

    # if playlist.user_id != user_id:
    #     return jsonify({"error": "Forbidden"}), 403
    
    # if song not in playlist.songs:
    playlist.songs.append(song)
    db.session.commit()

    return jsonify({"message": f"'{song.title}' added to '{playlist.name}'"}), 200


# remove a song from a playlist
@playlists_bp.route('/playlists/<int:playlist_id>/remove_song', methods=['POST'])
def remove_song_from_playlist(playlist_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    song_id = data.get('song_id')
    if not song_id:
        return jsonify({"error": "Song ID is required"}), 400

    playlist = Playlist.query.filter_by(id=playlist_id, user_id=user_id).first()
    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404

    song = Song.query.filter_by(id=song_id).first()
    if not song:
        return jsonify({"error": "Song not found"}), 404

    if song not in playlist.songs:
        return jsonify({"error": "Song is not in the playlist"}), 400

    playlist.songs.remove(song)
    db.session.commit()

    return jsonify({"message": "Song removed from playlist"}), 200


# update playlist name
@playlists_bp.route('/playlists/<int:playlist_id>', methods=['PATCH'])
def update_playlist(playlist_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.get_json()
    playlist = Playlist.query.get_or_404(playlist_id)

    name = data.get('name')
    if name:
        playlist.name = name
        db.session.commit()
        return playlist.to_dict(), 200
    return jsonify({'error': 'Name is required'}), 400


# Delete a Playlist
@playlists_bp.route('/playlists/<int:playlist_id>', methods=['DELETE'])
def delete_playlist(playlist_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    playlist = Playlist.query.get_or_404(playlist_id)

   
    db.session.delete(playlist)
    db.session.commit()
    return jsonify({'message': 'Playlist deleted'}), 200
