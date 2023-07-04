import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { registerUser } = useAuth();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "passwordConfirm") {
      setPasswordConfirm(value);
    }
  };

  const checkPasswordStrength = (password) => {
    const strongPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
    return strongPassword.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password || !passwordConfirm) {
      setError("All fields are required");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    if (!checkPasswordStrength(password)) {
      setError(
        "Password is not strong enough. It must contain at least one number, " +
          "one lowercase and one uppercase letter, and at least six characters that are letters, " +
          "numbers or the underscore"
      );
      return;
    }

    const userObject = {
      username: username,
      password: password
    };

    const result = await registerUser(userObject);

    if (result.error) {
      setError(`Failed to register: ${result.error}`);
      return;
    }

    console.log("Registration successful");
    setUsername("");
    setPassword("");

    navigate("/login", {
      state: { message: "Registration successful", username: username, password: password }
    });
  };

  return (
    <Box sx={{ m: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <hr />
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            id="username"
            label="Username"
            type="text"
            name="username"
            value={username}
            onChange={handleInputChange}
            margin="normal"
            style={{ width: '400px', display: 'flex', justifyContent: 'center' }}
          />

          <TextField
            id="password"
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            margin="normal"
            style={{ width: '400px', display: 'flex', justifyContent: 'center' }}
          />

          <TextField
            id="passwordConfirm"
            label="Confirm Password"
            type="password"
            name="passwordConfirm"
            value={passwordConfirm}
            onChange={handleInputChange}
            margin="normal"
            style={{ width: '400px', display: 'flex', justifyContent: 'center' }}
          />

          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" color="primary">
            Register
          </Button>
        </form>
      </div>
    </Box>
  );
};

export default Register;
