from extensions import db
from sqlalchemy_serializer import SerializerMixin
from werkzeug.security import generate_password_hash, check_password_hash



# Association Table for many-to-many relationship between Playlist and Songs
playlist_songs = db.Table('playlist_songs',
                            db.Column('playlist_id', db.Integer, db.ForeignKey('playlists.id'), primary_key=True),
                            db.Column('song_id', db.Integer, db.ForeignKey('songs.id'), primary_key=True)
                            )


# models here
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), unique=True)
    email = db.Column(db.String(120), unique=True)
    password_hash = db.Column(db.String(128))

    songs = db.relationship('Song', back_populates='user', lazy=True)
    playlists = db.relationship('Playlist', back_populates='user', lazy=True)

    # Don't serialize password hash
    # serialize_rules = ('-password_hash', '-songs.user', '-playlists.user')
    serialize_rules = ('-password_hash', '-songs.user', '-songs.playlists', '-playlists.user', '-playlists.songs')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    


class Song(db.Model, SerializerMixin):
    __tablename__ = 'songs'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    artist = db.Column(db.String(100))
    album = db.Column(db.String(100), nullable=True)
    source = db.Column(db.String(50))
    preview_url = db.Column(db.String(300), nullable=True) # for external music
    filename = db.Column(db.String(200), nullable=True) # for uploaded music

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates='songs')
    playlists = db.relationship("Playlist", secondary=playlist_songs, back_populates="songs")


    # serialize_rules = ('-user.songs', '-playlists.songs') #prevents nesting loop
    serialize_rules = ('-user.songs', '-user.playlists', '-playlists.songs', '-playlists.user')

    
class Playlist(db.Model, SerializerMixin):
    __tablename__ = 'playlists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # Relationships
    songs = db.relationship('Song', secondary=playlist_songs, back_populates='playlists')
    user = db.relationship('User', back_populates='playlists')

    serialize_rules = ('-user.playlists', '-user.songs', '-songs.user', '-songs.playlists')
    # serialize_rules = ('-user.playlists', '-songs.playlists', '-songs.user')
    # prevents playlist.user.playists, playlist.songs.playlists, playlist.songs.user