import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from '../../../hooks/auth/useAuth';
import Register from '../../../components/auth/Register';

// Mocking useState
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn()
}));

// Mocking useAuth
jest.mock('../../../hooks/auth/useAuth', () => ({
  useAuth: jest.fn()
}));

// Mocking useNavigate
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('Register component', () => {
  beforeEach(() => {
    React.useState.mockImplementation(jest.requireActual('react').useState);
    useAuth.mockReturnValue({
      registerUser: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByLabelText, getByRole } = render(<Router><Register /></Router>);
    expect(getByLabelText('Username')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
    expect(getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  it('shows an error message when fields are empty', async () => {
    const { getByRole, findByText } = render(<Router><Register /></Router>);
    fireEvent.click(getByRole('button'));
    expect(await findByText("All fields are required")).toBeInTheDocument();
  });

  it('shows an error message when passwords do not match', async () => {
    const { getByLabelText, getByRole, findByText } = render(<Router><Register /></Router>);
    fireEvent.change(getByLabelText('Username'), { target: { value: 'test' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password1' } });
    fireEvent.click(getByRole('button'));

    expect(await findByText("Passwords do not match")).toBeInTheDocument();
  });

  it('shows an error message when password is not strong enough', async () => {
    const { getByLabelText, getByRole, findByText } = render(<Router><Register /></Router>);
    fireEvent.change(getByLabelText('Username'), { target: { value: 'test' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password' } });
    fireEvent.click(getByRole('button'));

    expect(await findByText(
      "Password is not strong enough. It must contain at least one number, " +
        "one lowercase and one uppercase letter, and at least six characters that are letters, " +
        "numbers or the underscore"
    )).toBeInTheDocument();
  });
  
});
