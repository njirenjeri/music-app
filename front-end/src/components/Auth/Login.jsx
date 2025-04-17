import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { API_BASE_URL } from '../../App';
import '../../styles/Auth.css'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // State for success message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setMessage(''); // Clear previous messages
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage('Login successful! ');
      onLogin(); // Notify parent component about login
      setTimeout(() => navigate('/dashboard'), 2000); // Redirect after 2 seconds
    } else {
      const errorData = await res.json();
      setError(errorData.error || 'An error occurred');
      setTimeout(() => setError(''), 3000)

    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && (<p className="form-message error">{error}</p>)}
      {message && (<p className="form-message success">{message}</p>)} {/* Display success message */}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        <p className="auth-link">
          Don't have an account? <span onClick={() => navigate('/register')}>Sign up here</span>
        </p>
      </form>
    </div>
  )
}

export default Login