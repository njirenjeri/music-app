import React, { useState } from 'react';
import '../styles/Sidebar.css'


const Sidebar = ({ playlists, onSelect, onCreatePlaylist }) => {
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (newName.trim()) {
      onCreatePlaylist(newName);
      setNewName('');
      setShowInput(false);
    }
  };

  return (
    <aside className="sidebar">
      <div className="link" onClick={() => onSelect('songs')}>
        🎵 Songs
      </div>

      <div className="link" onClick={() => setShowPlaylists(!showPlaylists)}>
        🎧 Playlists {showPlaylists ? '▾' : '▸'}
      </div> 
      <div className="link" onClick={() => onSelect('artists')}>
        🎤 Artists
      </div>

      {showPlaylists && (
        <div className="playlist-section">
          {!showInput ? (
            <button className="new-playlist-btn" onClick={() => setShowInput(true)}>
              + New Playlist
            </button>
          ) : (
            <div className="new-playlist-input">
              <input
                type="text"
                placeholder="Playlist name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button onClick={handleCreate}>Add</button>
            </div>
          )}
          <ul className="submenu">
            {playlists.map((p) => (
              <li key={p.id} onClick={() => onSelect('playlist', p)}>
                {p.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
