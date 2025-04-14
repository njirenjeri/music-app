import React, { useState, useEffect } from 'react';
import '../styles/SongCard.css'
import { API_BASE_URL } from '../App';

const SongCard = ({ song, onBack, onAddToPlaylist, context, playlistId}) => {
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



  const handleCreateAndAddToPlaylist = async (playlistName) => {
    try {
      // create the playlist
      const createRes = await fetch(`${API_BASE_URL}/playlists`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({name: playlistName}),
      });

      if (!createRes.ok) {
        throw new Error('Failed to create playlist')
      }

      const newPlaylist = await createRes.json()

      // add the song to that playlist
      const addRes = await fetch (`${API_BASE_URL}/playlists/${newPlaylist.id}/add_song`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({song_id : song.id}),
      });

      if (!addRes.ok) {
        throw new Error('Failed to add song to playlist');
      }

      onAddToPlaylist(); // to refresh the side bar
      setShowModal(false); // close the modal
    } catch (err){
      console.error(err)
      alert('Something went wrong creating the playlist')
    }
  }



  const handleRemoveFromPlaylist = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/playlists/${playlistId}/remove_song`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ song_id: song.id }),
      });
  
      if (!res.ok) {
        throw new Error('Failed to remove song');
      }
  
      alert('Song removed from playlist');
      onAddToPlaylist(); // refresh the playlist
      onBack(); // go back to playlist view
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }

//   const handleRemoveFromPlaylist = async (playlistId) => {
//     await fetch(`${API_BASE_URL}/playlists/${playlistId}/remove_song`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({ song_id: song.id }),
//     });
//     setShowModal(false);
//   };

//   const handleCreatePlaylist = async () => {
//     const res = await fetch(`${API_BASE_URL}/playlists`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({ name: newPlaylistName }),
//     });
//     const data = await res.json();
//     setPlaylists(prev => [...prev, data]);
//     setNewPlaylistName('');
//     setShowForm(false);

//   };
  


  return (
    <div className="song-card">
      <button onClick={onBack}>Back</button>
      <h3>{song.title}</h3>
      <p>{song.artist}</p>
      <audio 
        controls 
        src={song.preview_url
          ? song.preview_url
          : `${API_BASE_URL}/uploads/${song.filename}`
        }
      ></audio>
    
      {context === 'playlist' ? (
        <button onClick={() => handleRemoveFromPlaylist} className='delete-btn'>Remove From Playlist</button>
      ) : (
         <button onClick={() => setShowModal(true)}>Add to Playlist</button> 
        
      )
    }

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Select a Playlist</h4>
            {playlists.length ? (
              playlists.map(p => (
                <div key={p.id}>
                  <button onClick={() => handleAddToPlaylist(p.id)}>
                    Add to {p.name}
                  </button>
                  <button onClick={() => handleRemoveFromPlaylist(p.id)}>
                    Remove from {p.name}
                  </button>
                </div>
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
                <button onClick={() => handleCreateAndAddToPlaylist(newPlaylistName)}>Create</button>
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
