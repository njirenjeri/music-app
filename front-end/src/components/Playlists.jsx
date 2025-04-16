import React, { useState } from 'react';
import { BsPencil, BsTrash } from 'react-icons/bs';
import '../styles/Playlists.css'


const PlayList = ({ playlists, onSelect, onEdit, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);

  const handleEditClick = (playlist) => {
    setEditingId(playlist.id);
    setNewName(playlist.name);
  };

  const handleEditSubmit = (id) => {
    if (newName.trim()) {
      onEdit(id, newName);
    }
    setEditingId(null);
  };

  const confirmDelete = (playlist) => {
    setPlaylistToDelete(playlist);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = () => {
    onDelete(playlistToDelete.id);
    setShowDeleteModal(false);
    setPlaylistToDelete(null);
  };

  return (
    <>
      <ul className="submenu">
        {playlists.map((p) => (
          <li key={p.id} className="playlist-item">
            {editingId === p.id ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={() => handleEditSubmit(p.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit(p.id)}
                autoFocus
              />
            ) : (
              <span onClick={() => onSelect('playlist', p)}>{p.name}</span>
            )}
            <div className="playlist-actions">
              <BsPencil title="Edit" className="icon" onClick={() => handleEditClick(p)} />
              <BsTrash title="Delete" className="icon" onClick={() => confirmDelete(p)} />
            </div>
          </li>
        ))}
      </ul>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to delete the playlist "<strong>{playlistToDelete.name}</strong>"?</p>
            <div className="modal-buttons">
              <button onClick={handleDeleteConfirmed}>Yes, Delete</button>
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlayList;
