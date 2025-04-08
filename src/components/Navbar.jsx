import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link> | 
      <Link to="/artists">Artists</Link> | 
      <Link to="/songs">Songs</Link> | 
      <Link to="/login">Login</Link>
    </nav>
  );
}

export default Navbar;
