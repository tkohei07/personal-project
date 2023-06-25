import { useState } from 'react';
import authService from '../../services/authService';

export const useAuth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState(null);

  const registerUser = async (userObject) => {
    const result = await authService.register(userObject);

    if (result.error) {
      setError(result.error);
    }
    return result;
  };

  const loginUser = async (userObject) => {
    const result = await authService.login(userObject);
    if (result.error) {
      setError(result.error);
    }
    return result;
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    error,
    setError,
    registerUser,
    loginUser
  };
};