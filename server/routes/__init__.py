# Initialize the Blueprint for routes
from .auth import auth_bp
from .songs import songs_bp
from .playlists import playlists_bp

__all__ = ['auth_bp', 'songs_bp', 'playlists_bp']