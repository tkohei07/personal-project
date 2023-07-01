import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import { useAuth } from '../../../hooks/auth/useAuth';
import Login from '../../../components/auth/Login';

jest.mock('../../../contexts/UserContext', () => ({
  useUser: jest.fn()
}));

jest.mock('../../../hooks/auth/useAuth', () => ({
  useAuth: jest.fn()
}));

describe('Login component', () => {
  beforeEach(() => {
    useUser.mockReturnValue({ setLoggedIn: jest.fn(), setUserId: jest.fn() });
    useAuth.mockReturnValue({
      username: "",
      setUsername: jest.fn(),
      password: "",
      setPassword: jest.fn(),
      error: "",
      setError: jest.fn(),
      loginUser: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = render(<Router><Login /></Router>);
    expect(getByText('Username')).toBeInTheDocument();
    expect(getByText('Password')).toBeInTheDocument();
    expect(getByText('Login')).toBeInTheDocument();
  });

  it('navigates to the home page when login is successful', async () => {
    const mockUser = { id: '1', token: 'token' };
    useAuth.mockReturnValue({
      username: "test",
      setUsername: jest.fn(),
      password: "test",
      setPassword: jest.fn(),
      error: "",
      setError: jest.fn(),
      loginUser: jest.fn().mockReturnValue(mockUser)
    });

    const { getByRole } = render(<Router><Login /></Router>);
    fireEvent.click(getByRole('button'));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });
});
