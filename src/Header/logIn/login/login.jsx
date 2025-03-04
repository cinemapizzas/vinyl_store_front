import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = ({ setLoggedIn }) => { 
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const startTimer = () => {
    let timeLeft = 120; 
    const intervalId = setInterval(() => {
      console.log(`Time left until token expiration: ${timeLeft} seconds`);
      timeLeft--;
      if (timeLeft < 0) {
        clearInterval(intervalId);
        console.log("Token has expired!");
        logoutUser(); 
      }
    }, 1000);
    setTimer(intervalId);
  };
  
  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    console.log("You have been logged out due to session expiration.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/user/login', formData);
      console.log('Full response:', response);
      
      if (response.data && response.data.token && response.data.user) {
        console.log('Login successful:', response.data);
        console.log('Token:', response.data.token);
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        startTimer(); 
        
        setIsLoading(false);
        setLoggedIn(true); // Call setLoggedIn after successful login
        navigate('/');
      } else {
        setError('Invalid response from server');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        setError(error.response.data.err || 'Login failed. Please try again.');
      } else if (error.request) {
        console.log(error.request);
        setError('No response from server. Please try again.');
      } else {
        console.log('Error', error.message);
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
