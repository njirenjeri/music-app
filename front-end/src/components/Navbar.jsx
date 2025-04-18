import React from 'react';
import '../styles/Navbar.css'
import logo from '../jukebox.png'

const Navbar = ({ query, setQuery, username, onLogout, isLoading }) => (
  <nav className="navbar">
    <div className="logo">
        <img src={logo} alt="logo" /> <h4>The JukeBox</h4>
        <link rel="icon" type="image/svg+xml" href="./src/jukebox.png" />
    </div>
    <input
      type="text"
      placeholder="Search music..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
    {isLoading && <span>Loading...</span>}
    <div className="user-info">
      <span>Hi, {username.charAt(0).toUpperCase() + username.slice(1)}</span>
      <button onClick={onLogout}>Logout</button>
    </div>
  </nav>
);

export default Navbar;
