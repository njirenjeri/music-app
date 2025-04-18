from flask import Flask
from extensions import db, migrate
from flask_cors import CORS
from routes.auth import auth_bp
from routes.songs import songs_bp
from routes.playlists import playlists_bp
import logging
import os

app = Flask(__name__)

# CORS(app, supports_credentials=True)
# app.secret_key = 'super-secret-key'   #needed for session auth

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # DB Configurations
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///music_app.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialise exts
# db = SQLAlchemy(app)
# migrate = Migrate(app, db)

app.config.update(
    SESSION_COOKIE_SAMESITE="None",
    SESSION_COOKIE_SECURE=True,
)

# Enable CORS for frontend domain
CORS(app, supports_credentials=True, origins=os.environ.get("CORS_ORIGINS"))

# Secret key (needed for session auth)
app.secret_key = os.environ.get("SECRET_KEY", "super-secret-key")

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    "DATABASE_URL", "sqlite:///music_app.db"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


# Initialize extensions
db.init_app(app)
migrate.init_app(app, db)


# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(songs_bp, url_prefix='/api')
app.register_blueprint(playlists_bp, url_prefix='/api')

@app.errorhandler(404)
def not_found_error(error):
    logger.error(f"404 Error: {error}")
    return {"error": "Resource not found"}, 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"500 Error: {error}")
    return {"error": "Internal server error"}, 500


# main entry
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)