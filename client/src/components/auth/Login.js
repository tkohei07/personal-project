import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useAuth } from '../../hooks/auth/useAuth';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';

const RegisterLink = styled(Link)({
  color: 'blue',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

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
    <Box sx={{ m: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <hr />
      <form onSubmit={handleSubmit}>
        <TextField
          id="username"
          label="Username"
          type="text"
          name="username"
          value={username}
          onChange={handleUsernameChange}
          margin="normal"
          style={{ width: '400px', display: 'flex', justifyContent: 'center' }}
        />

        <TextField
          id="password"
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
          margin="normal"
          style={{ width: '400px', display: 'flex', justifyContent: 'center' }}
        />

        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </form>
      <br />
      <Typography variant="body1">
        Don't have an account? <RegisterLink to="/register">Register here</RegisterLink>
      </Typography>
    </Box>
  );
};

export default Login;
