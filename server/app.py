from flask import Flask
from extensions import db, migrate
from flask_cors import CORS
from routes.auth import auth_bp
from routes.songs import songs_bp
from routes.playlists import playlists_bp


app = Flask(__name__)

CORS(app, supports_credentials=True)
app.secret_key = 'super-secret-key' #needed for session auth

# DB Configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///music_app.db'
app.config['SQLALCHEMY_TRACH_MODIFICATIONS'] = False

# Initialise exts
# db = SQLAlchemy(app)
# migrate = Migrate(app, db)

# Initialize extensions
db.init_app(app)
migrate.init_app(app, db)


# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(songs_bp, url_prefix='/api')
app.register_blueprint(playlists_bp, url_prefix='/api')



if __name__ == '__main__':
    app.run(debug=True)