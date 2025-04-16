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
  const [searchMode, setSearchMode] = useState(false)
  const [downloadMessage, setDownloadMessage] = useState('');
  const [sortDescending, setSortDescending] = useState(false);
  const [message, setMessage] = useState('');



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
    if (res.ok) {
      localStorage.removeItem('user')
      window.location.href = '/login';
    }
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


  useEffect(() => {
    setSearchMode(query.trim().length > 0 && Array.isArray(results) && results.length > 0);
  }, [query, results]);



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
        setDownloadMessage(`"${song.trackName}" downloaded successfully!`)

        setTimeout(() => setDownloadMessage(''), 3000)
      };
      
      
      const handleSelect = (view, data = null) => {
        setSelectedView(view);
        setSelectedData(data);
        setQuery('') //clears search input
        setSearchMode(false) //exists search mode on manual selection
      };
      
      console.log("Selected View:", selectedView);
      console.log("Selected Data:", selectedData);

  return (
    <div className="dashboard-layout">
      <Navbar 
        query={query} 
        setQuery={setQuery} 
        username={username} 
        onLogout={handleLogout} 
        isLoading={false}
        />
        {message && (
          <div className="global-message">
            {message}
          </div>
        )}
      {downloadMessage && <div className="download-notification">{downloadMessage}</div>}

      <div className="main-content-wrapper">
        <Sidebar playlists={playlists} onSelect={handleSelect} />
        <main className="main-content">
          {/* iTunes Search Results */}
          {searchMode && (
            <div className="search-results">
              <h2>Search Results</h2>
              <ul>
                {Array.isArray(results) && results.slice(0, 15).map((song) => (
                  <li key={song.trackId} className="search-item">
                    {song.trackName} by {song.artistName}
                    {/* <button onClick={() => handleDownload(song)}>Download</button> */}
                    <FaDownload className="download-icon" onClick={() => handleDownload(song)} />
                  </li>
              ) )}
              </ul>
            </div>
          )}

          {/* SongCard View */}
          {selectedView === 'songCard' && selectedData && (
            <SongCard
              song={selectedData}
              playlistId= {selectedData.playlist_id}
              context={selectedData.context}
              setMessage={setMessage}
              onBack={() => 
                selectedView(setSelectedView.context === 'playlist' ? 'playlist' : 'songs')
              }
               onAddToPlaylist={() => {
                fetchPlaylists();
              }}              
            />
          )}



          {/* Artists view */}
          {selectedView === 'artists' && (
            <div>
              <h2>Artists</h2>
              <p>Display artist-related content here.</p>
            </div>

          )}

            {/*songs views  */}
          {selectedView === 'songs' && (
            <ul className="song-list">
              <div className="song-list-header">
                <h2>My Music</h2>
                <button onClick={() => setSortDescending((prev) => !prev)}>
                  Sort {sortDescending ? 'A-Z' : 'Z-A'}
                </button>
              </div>
                {[...songs]
                  .sort((a,b) => 
                  sortDescending
                ? b.title.localeCompare(a.title)
                : a.title.localeCompare(b.title)
              )
                .map((song) => (
                  <li 
                    key={song.id} 
                    onClick={() => handleSelect('songCard', {...song, context: 'songs'})}
                  >
                    {song.title} by {song.artist}
                  </li>
                ))}
            </ul>
          )}

          {/* Platylist view */}
          {selectedView === 'playlist' && selectedData && (
            <div>
              <div className="song-list-header">
                <h2>{selectedData.name}</h2>
                <button onClick={() => setSortDescending((prev) => !prev)}>
                  Sort {sortDescending ? 'A-Z' : 'Z-A'}
                </button>
              </div>

              {/* display playlist songs here */}
              <ul className="song-list">
                {selectedData.songs && selectedData.songs.length > 0 ? (
                  [...selectedData.songs]
                    .sort((a,b) => 
                      sortDescending
                        ? b.title.localeCompare(a.title)
                        : a.title.localeCompare(b.title)
                  )               
                  .map((song) => (
                    <li 
                      key={song.id} 
                      onClick={() => handleSelect('songCard', {...song, context: 'playlist', playlist_id: selectedData.id})}
                    >
                      {song.title} by {song.artist}
                    </li>
                  ))
                ): (
                  <li>No songs in this playlist.</li>
                )}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
