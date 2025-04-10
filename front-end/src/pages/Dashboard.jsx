import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../App';
import SongCard from '../components/SongCard';
import { FaDownload } from 'react-icons/fa'

const Dashboard = () => {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

  const fetchSongs = async () => {
    const res = await fetch(`${API_BASE_URL}/songs`, { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        setSongs(data);
      } else if (data.message) {
        setSongs([]);
      }
    }
  };

  // live search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() !== '') {
        fetch(`${API_BASE_URL}/search/itunes?q=${query}`)
          .then(res => res.json())
          .then(data => setResults(data));
      } else {
        setResults([]);
      }
    }, 300); // debounce for 300ms

    return () => clearTimeout(delayDebounce);
  }, [query]);




  const handleDownload = async (song) => {
    const res = await fetch(`${API_BASE_URL}/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        title: song.trackName,
        artist: song.artistName,
        album: song.collectionName,
        source: 'iTunes',
        preview_url: song.previewUrl,
        filename: `${song.trackName}-${song.artistName}`,
      }),
    });
    if (res.ok) fetchSongs();
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  if (selectedSong) {
    return (
      <SongCard
        song={selectedSong}
        onBack={() => setSelectedSong(null)}
        onAddToPlaylist={() => alert('Song added')}
      />
    );
  }

  return (
    <div className="dashboard">

      {/* Search Section */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search music..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Quick Links */}
      <div className="quick-links">
        <a href="/playlists">Playlists</a>
      </div>
      <h2>Your Songs</h2>


      {/* Search Results Overlay */}
      {results.length > 0 && (
        <div className="search-results-overlay">
          <ul>
            {results.slice(0, 5).map((song) => (
              <li key={song.trackId}>
                {song.trackName} by {song.artistName}
                <div className="download-button">
                    <button onClick={() => handleDownload(song)}>
                        <FaDownload/>
                    </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Song List */}
      <ul className="song-list">
        {songs.map((song) => (
          <li key={song.id} onClick={() => setSelectedSong(song)}>
            {song.title} by {song.artist}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
