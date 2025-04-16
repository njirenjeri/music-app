import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../App';
import '../../styles/Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) return false;

    const domain = email.split('@')[1];
    return validDomains.includes(domain.toLowerCase());
  }

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    return passwordRegex.test(password)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    setMessage(''); // Clear previous messages
    
    if (!isValidEmail(email)){
      setMessage('Enter a valid email')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    
    if (!isValidPassword(password)) {
      setMessage("Password must be at least of length 6, contain a capital letter and a symbol")
      setTimeout(() => setMessage(''), 3000)
      return
    }

    try{
    
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
      });
      if (res.ok) {

        const data = await res.json();
        console.log("Registered user data: ", data)
        localStorage.setItem('user', JSON.stringify(data.user));
        // navigate('/dashboard');
        window.location.href = '/dashboard';
      }else{
        const error = await res.json();
        setMessage(error?.error || "Registration Failed");

      }
    } catch (err) {
      const errorData = await res.json();
      setError(errorData.error || 'An error occurred');
      setMessage("Network error. please try again")
      console.error("Registration error", err);
      
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {message && (<p className="form-message error">{message} </p>)}
      {error && (<p className="form-message error">{error} </p>)}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
        <p className="auth-link">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>Log in here</span>
        </p>
      </form>
    </div>
  );
};

export default Register;