function Home() {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>🎵 Welcome to Play Music App 🎵</h1>
        <p style={styles.subtext}>
          Explore a wide variety of songs, connect with your favorite artists, and create your perfect playlist!
        </p>
        <img 
          src="https://cdn.pixabay.com/photo/2016/11/29/12/54/audio-1867121_960_720.jpg" 
          alt="Music Vibes" 
          style={styles.image} 
        />
      </div>
    );
  }
  
  const styles = {
    container: {
      padding: "2rem",
      textAlign: "center",
    },
    heading: {
      fontSize: "2.5rem",
      color: "#4a4a4a",
      marginBottom: "1rem",
    },
    subtext: {
      fontSize: "1.2rem",
      color: "#777",
      marginBottom: "2rem",
    },
    image: {
      maxWidth: "80%",
      height: "auto",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
  };
  
  export default Home;
  