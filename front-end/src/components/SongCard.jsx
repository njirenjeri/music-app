import React, { useState, useEffect } from 'react';
import '../styles/SongCard.css'
import { API_BASE_URL } from '../App';

const SongCard = ({ song, onBack, onAddToPlaylist }) => {
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      const res = await fetch(`${API_BASE_URL}/playlists`, { credentials: 'include' });
      const data = await res.json();
      setPlaylists(data);
    };
    fetchPlaylists();
  }, []);

  const handleAddToPlaylist = async (playlistId) => {
    await fetch(`${API_BASE_URL}/playlists/${playlistId}/add_song`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ song_id: song.id }),
    });
    onAddToPlaylist();
    setShowModal(false);
  };

  const handleCreatePlaylist = async () => {
    const res = await fetch(`${API_BASE_URL}/playlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: newPlaylistName }),
    });
    const data = await res.json();
    setPlaylists(prev => [...prev, data]);
    setNewPlaylistName('');
    setShowForm(false);
  };

  return (
    <div className="song-card">
      <button onClick={onBack}>Back</button>
      <h3>{song.title}</h3>
      <p>{song.artist}</p>
      <audio controls src={song.preview_url}></audio>

      <button onClick={() => setShowModal(true)}>Add to Playlist</button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Select a Playlist</h4>
            {playlists.length ? (
              playlists.map(p => (
                <button key={p.id} onClick={() => handleAddToPlaylist(p.id)}>
                  {p.name}
                </button>
              ))
            ) : (
              <p>No playlists found</p>
            )}

            {showForm ? (
              <div>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="New playlist name"
                />
                <button onClick={handleCreatePlaylist}>Create</button>
              </div>
            ) : (
              <button onClick={() => setShowForm(true)}>+ New Playlist</button>
            )}
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongCard;
