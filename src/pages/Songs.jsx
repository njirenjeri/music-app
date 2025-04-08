import { useState, useEffect } from "react";
import SongForm from "../forms/SongForm";

function Songs() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/songs")
      .then((res) => res.json())
      .then(setSongs);
  }, []);

  const handleAddSong = (songData) => {
    fetch("http://localhost:5000/songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(songData),
    })
      .then((res) => res.json())
      .then((newSong) => setSongs((prev) => [...prev, newSong]));
  };

  return (
    <div>
      <h2>Songs</h2>
      <SongForm onSubmit={handleAddSong} />
      <ul>
        {songs.map((song) => (
          <li key={song.id}>{song.title} - {song.duration} min</li>
        ))}
      </ul>
    </div>
  );
}

export default Songs;
