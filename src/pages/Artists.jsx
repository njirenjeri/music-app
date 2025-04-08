import { useEffect, useState } from "react";

function Artists() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/artists")
      .then((res) => res.json())
      .then((data) => setArtists(data))
      .catch((err) => console.error("Error fetching artists:", err));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🎤 Featured Artists</h2>
      <div style={styles.grid}>
        {artists.map((artist) => (
          <div key={artist.id} style={styles.card}>
            <img
              src={artist.image_url || "https://via.placeholder.com/150"}
              alt={artist.name}
              style={styles.image}
            />
            <h3 style={styles.name}>{artist.name}</h3>
            <p style={styles.bio}>{artist.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    textAlign: "center",
  },
  heading: {
    fontSize: "2rem",
    color: "#333",
    marginBottom: "1.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "1rem",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  name: {
    marginTop: "0.5rem",
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  bio: {
    fontSize: "0.9rem",
    color: "#666",
  },
};

export default Artists;
