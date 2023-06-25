import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '../form/Input';
import { useUser } from '../../contexts/UserContext';
import { useAuth } from '../../hooks/auth/useAuth';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setLoggedIn, setUserId } = useUser();

  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    setError,
    loginUser
  } = useAuth();

  // Add these lines to use the state passed from the Register
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message);
      setUsername(location.state.username || "");
      setPassword(location.state.password || "");
    }
  }, [location]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userObject = {
      username,
      password
    };

    const result = await loginUser(userObject);
    if (result.error) {
      setError(result.error);
    } else {
      localStorage.setItem('token', result.token);
      console.log('Login successful');
      setLoggedIn(true);
      setUserId(result.id);
      navigate("/");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          title="Username"
          type="text"
          className="form-control"
          name="username"
          value={username}
          onChange={handleUsernameChange}
        />

        <Input
          title="Password"
          type="password"
          className="form-control"
          name="password"
          value={password}
          onChange={handlePasswordChange}
        />
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <button type="submit">Login</button>
      </form>
      <br />
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
};

export default Login;
