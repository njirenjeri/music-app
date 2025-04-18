import React, { useState } from 'react';
import '../styles/Sidebar.css'
import PlayList from './Playlists';
// import { API_BASE_URL } from '../App';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const Sidebar = ({ playlists, setPlaylists, onSelect, onEdit, onDelete }) => {
  const [showPlaylists, setShowPlaylists] = useState(false);
  // const [playlists, setPlaylists] = useState([]);

// Edit handler
const handleEditPlaylist = async (id, newName) => {
  const res = await fetch(`${API_BASE_URL}/playlists/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name: newName }),
  });
  const updated = await res.json();

  // Update local state
  setPlaylists(prev =>
    prev.map(p => (p.id === id ? { ...p, name: updated.name } : p))
  );
};

// Delete handler
const handleDeletePlaylist = async (id) => {
  await fetch(`${API_BASE_URL}/playlists/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  // Remove from local state
  setPlaylists(prev => prev.filter(p => p.id !== id));
};


  return (
    <aside className="sidebar">
      <div className="link" onClick={() => onSelect('songs')}>
        🎵 Songs
      </div>

      <div className="link" onClick={() => setShowPlaylists(!showPlaylists)}>
        🎧 Playlists {showPlaylists ? '▾' : '▸'}
      </div> 
      
      {showPlaylists && (
        <PlayList
        playlists={playlists}
        onSelect={onSelect}
        onEdit={handleEditPlaylist}
        onDelete={handleDeletePlaylist}      
      />
      )}
    </aside>
  );
};

export default Sidebar;
