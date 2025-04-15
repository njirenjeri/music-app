# music-app

## Features
- User authentication (register, login, logout)
- Create, edit, and delete playlists
- Add and remove songs from playlists
- Search for songs using iTunes API
- Responsive design for mobile and desktop

## Setup Instructions

### Backend
1. Navigate to the `server` directory.
2. Install dependencies: `pip install -r requirements.txt`.
3. Run the Flask app: `flask run`.

### Frontend
1. Navigate to the `front-end` directory.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

### Database
1. Run migrations: `flask db upgrade`.

### Environment Variables
- Set `FLASK_APP=app.py` and `FLASK_ENV=development` for development.