from flask import Flask
from extensions import db, migrate
from flask_cors import CORS
from routes.auth import auth_bp
from routes.songs import songs_bp
from routes.playlists import playlists_bp
import logging

app = Flask(__name__)

CORS(app, supports_credentials=True)
app.secret_key = 'super-secret-key' #needed for session auth

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# DB Configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///music_app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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

@app.errorhandler(404)
def not_found_error(error):
    logger.error(f"404 Error: {error}")
    return {"error": "Resource not found"}, 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"500 Error: {error}")
    return {"error": "Internal server error"}, 500

if __name__ == '__main__':
    app.run(debug=True)