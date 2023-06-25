import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../form/Input";
import { useAuth } from "../../hooks/auth/useAuth";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { registerUser } = useAuth();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePasswordConfirmChange = (event) => {
    setPasswordConfirm(event.target.value);
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

        <Input
          title="Confirm Password"
          type="password"
          className="form-control"
          name="passwordConfirm"
          value={passwordConfirm}
          onChange={handlePasswordConfirmChange}
        />

        <button type="submit">Register</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
