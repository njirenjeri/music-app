from flask import Blueprint, request, jsonify, session
from models import Playlist, Song, db


# create a blueprint for Playlist routes
playlist_bp = Blueprint('playlists', __name__)


# Get all playlists created by a logged-in user
@playlist_bp.route('/playlists', methods=['GET'])
def get_user_playlists():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    playlists = Playlist.query.filter_by(user_id=user_id).all()
    return jsonify([p.to_to_dict() for p in playlists])



# Get all songs in a specific playlist
@playlist_bp.route('/playlists/<int:playlist_id>/songs', methods=['POST'])
def add_song_to_playlist(playlist_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    playlist = Playlist.query.get_or_404(playlist_id)
    if playlist.user_id != user_id:
        return jsonify({"error": "Forbidden"}), 403
    
    return jsonify([s.to_dict()] for s in playlist.songs)

# add song to a specific playlist
@playlist_bp.route('/playlists/<int:playlist_id>/add_song', methods=['POST'])
def add_song_to_playlist(playlist_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.get_json()
    song = Song.query.get_or_404(data['song_id'])
    playlist = Playlist.query.get_or_404(playlist_id)

    if playlist.user_id != user_id:
        return jsonify({"error": "Forbidden"}), 403
    
    if song not in playlist.songs:
        playlist.songs.append(song)
        db.session.commit()

    return jsonify({"message": "Song added to playlist"})


# remove a song from a playlist
@playlist_bp.route('playlists/<int:playlist_id>/remove_song', methods=['POST'])
def remove_song_from_playlist(playlist_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    
    data = request.get_json()
    song = Song.query.get_or_404(data['song_id'])
    playlist = Playlist.query.get_or_404(playlist_id)

    if playlist.user_id != user_id:
        return jsonify({"error": "Forbidden"}), 403
    
    if song in playlist.songs:
        playlist.songs.remove(song)
        db.session.commit()

    return jsonify({"message": "Song removed from playlist"})