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
    const { getByText } = render(<Router><Register /></Router>);
    expect(getByText('Username')).toBeInTheDocument();
    expect(getByText('Password')).toBeInTheDocument();
    expect(getByText('Confirm Password')).toBeInTheDocument();
    expect(getByText('Register')).toBeInTheDocument();
  });

  it('shows an error message when fields are empty', async () => {
    const { getByRole, findByText } = render(<Router><Register /></Router>);
    fireEvent.click(getByRole('button'));
    expect(await findByText("All fields are required")).toBeInTheDocument();
  });

  it('shows an error message when passwords do not match', async () => {
    const { getByText, getByLabelText, findByText } = render(<Router><Register /></Router>);
    fireEvent.change(getByLabelText('Username'), { target: { value: 'test' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password1' } });
    fireEvent.click(getByText('Register'));

    expect(await findByText("Passwords do not match")).toBeInTheDocument();
  });

  it('shows an error message when password is not strong enough', async () => {
    const { getByText, getByLabelText, findByText } = render(<Router><Register /></Router>);
    fireEvent.change(getByLabelText('Username'), { target: { value: 'test' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password' } });
    fireEvent.click(getByText('Register'));

    expect(await findByText(
      "Password is not strong enough. It must contain at least one number, " +
        "one lowercase and one uppercase letter, and at least six characters that are letters, " +
        "numbers or the underscore"
    )).toBeInTheDocument();
  });
  
});
