// import React, { useState, useEffect } from 'react';
// import { API_BASE_URL } from '../App';
// import SongCard from '../components/SongCard';
// import { FaDownload } from 'react-icons/fa'

// const Dashboard = () => {
//   const [songs, setSongs] = useState([]);
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState([]);
//   const [selectedSong, setSelectedSong] = useState(null);

//   const fetchSongs = async () => {
//     const res = await fetch(`${API_BASE_URL}/songs`, { credentials: 'include' });
//     if (res.ok) {
//       const data = await res.json();
//       if (Array.isArray(data)) {
//         setSongs(data);
//       } else if (data.message) {
//         setSongs([]);
//       }
//     }
//   };

//   // live search
//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (query.trim() !== '') {
//         fetch(`${API_BASE_URL}/search/itunes?q=${query}`)
//           .then(res => res.json())
//           .then(data => setResults(data));
//       } else {
//         setResults([]);
//       }
//     }, 300); // debounce for 300ms

//     return () => clearTimeout(delayDebounce);
//   }, [query]);




//   const handleDownload = async (song) => {
//     const res = await fetch(`${API_BASE_URL}/songs`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({
//         title: song.trackName,
//         artist: song.artistName,
//         album: song.collectionName,
//         source: 'iTunes',
//         preview_url: song.previewUrl,
//         filename: `${song.trackName}-${song.artistName}`,
//       }),
//     });
//     if (res.ok) fetchSongs();
//   };

//   useEffect(() => {
//     fetchSongs();
//   }, []);

//   if (selectedSong) {
//     return (
//       <SongCard
//         song={selectedSong}
//         onBack={() => setSelectedSong(null)}
//         onAddToPlaylist={() => alert('Song added')}
//       />
//     );
//   }

//   const handleLogout = async () => {
//     const res = await fetch(`${API_BASE_URL}/logout`, {
//       method: 'POST',
//       credentials: 'include'
//     });
//     if (res.ok) {
//       // Optional: redirect to login or homepage
//       window.location.href = '/login';
//     }
//   };
  

//   return (
//     <div className="dashboard">

//       {/* Search Section */}
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Search music..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//       </div>

//       <div className="logout-container">
//         <button onClick={handleLogout}>Logout</button>
//       </div>


//       {/* Quick Links */}
//       <div className="quick-links">
//         <a href="/playlists">Playlists</a>
//       </div>
//       <h2>Your Songs</h2>


//       {/* Search Results Overlay */}
//       {results.length > 0 && (
//         <div className="search-results-overlay">
//           <ul>
//             {results.slice(0, 5).map((song) => (
//               <li key={song.trackId}>
//                 {song.trackName} by {song.artistName}
//                 <div className="download-button">
//                     <button onClick={() => handleDownload(song)}>
//                         <FaDownload/>
//                     </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Song List */}
//       <ul className="song-list">
//         {songs.map((song) => (
//           <li key={song.id} onClick={() => setSelectedSong(song)}>
//             {song.title} by {song.artist}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SongCard from '../components/SongCard';
import { API_BASE_URL } from '../App';
import '../styles/Dashboard.css'
import { FaDownload } from 'react-icons/fa';


const Dashboard = () => {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [username, setUsername] = useState('');
  const [selectedView, setSelectedView] = useState('songs');
  const [selectedData, setSelectedData] = useState(null);

  const fetchSongs = async () => {
    const res = await fetch(`${API_BASE_URL}/songs`, { credentials: 'include' });
    const data = await res.json();
    console.log("Fetched Songs: ", data);
    setSongs(Array.isArray(data) ? data : data.songs || []);
    // if (res.ok) setSongs(await res.json());
  };

  const fetchPlaylists = async () => {
    const res = await fetch(`${API_BASE_URL}/playlists`, { credentials: 'include' });
    if (res.ok) setPlaylists(await res.json());
  };

  const fetchUserInfo = () => {
    const user = JSON.parse(localStorage.getItem('user')); // Assuming user info is saved here
    if (user) {
      setUsername(user.username); // Set username from localStorage
    }
  };

  const handleLogout = async () => {
    const res = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) window.location.href = '/login';
  };

  useEffect(() => {
    fetchSongs();
    fetchPlaylists();
    fetchUserInfo(); // Fetch user info from local storage or session
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        fetch(`${API_BASE_URL}/search/itunes?q=${query}`)
          .then((res) => res.json())
          .then((data) => setResults(data));
      } else {
        setResults([]);
      }
    }, 300);
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
      
      const handleSelect = (view, data = null) => {
        setSelectedView(view);
        setSelectedData(data);
      };
      
      console.log("Selected View:", selectedView);
      console.log("Selected Data:", selectedData);

  return (
    <div className="dashboard-layout">
      <Navbar query={query} setQuery={setQuery} username={username} onLogout={handleLogout} />
      <div className="main-content-wrapper">
        <Sidebar playlists={playlists} onSelect={handleSelect} />
        <main className="main-content">
          {/* iTunes Search Results */}
          {results.length > 0 ? (
            <div className="search-results">
              <h2>Search Results</h2>
              <ul>
                {results.slice(0, 5).map((song) => (
                  <li key={song.trackId} className="search-item">
                    {song.trackName} by {song.artistName}
                    {/* <button onClick={() => handleDownload(song)}>Download</button> */}
                    <FaDownload className="download-icon" onClick={() => handleDownload(song)} />
                  </li>
              ) )}
              </ul>
            </div>
          ) :   selectedView === 'songCard' && selectedData ? (
            <>
            <SongCard
              song={selectedData}
              playlistId= {selectedData.playlist_id}
              context={selectedData.context}
              onBack={() => {
                if (selectedView === 'playlist') {
                  setSelectedView('playlist')
                }else{
                  setSelectedView('songs')
                }
              }}
               onAddToPlaylist={() => {
                fetchPlaylists();
              }}
              
            />
            </>
          ) : selectedView === 'songs' ? (
            <ul className="song-list">
              <h2>My Music</h2>
              {songs.map((song) => (
                <li key={song.id} onClick={() => handleSelect('songCard', {...song, context: 'songs'})}>
                  {song.title} by {song.artist}
                </li>
              ))}
            </ul>
          ) : selectedView === 'playlist' && selectedData ? (
            <div>
              <h2>{selectedData.name}</h2>
              {/* display playlist songs here */}
              <ul className="song-list">
                {selectedData.songs && selectedData.songs.length > 0 ? (
                  selectedData.songs.map((song) => (
                    <li key={song.id} onClick={() => handleSelect('songCard', {...song, context: 'playlist'})}>
                      {song.title} by {song.artist}
                    </li>
                  ))
                ) : (
                  <li>No songs in this playlist.</li>
                )}
              </ul>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
