import authService from '../../../services/authService';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

it('logs in a user when login is called', async () => {
  const mockUser = { username: 'testuser', password: 'testpass' };
  const mockResponse = { token: 'testtoken', id: 1 };
  
  fetch.mockResponseOnce(JSON.stringify(mockResponse));

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mockUser),
  };

  const response = await authService.login(mockUser);

  expect(response).toEqual(mockResponse);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/authenticate`, requestOptions);
});

it('returns an error when login fails', async () => {
  const mockUser = { username: 'testuser', password: 'wrongpass' };
  const mockErrorResponse = { message: 'Invalid password.' };
  
  fetch.mockResponseOnce(JSON.stringify(mockErrorResponse), { status: 401 });

  const response = await authService.login(mockUser);

  expect(response.error).toEqual(`Failed to login: ${mockErrorResponse.message}`);
  expect(fetch).toHaveBeenCalledTimes(1);
});

it('registers a user when register is called', async () => {
  const mockUser = { username: 'newuser', password: 'newpass' };
  const mockResponse = { id: 1, username: 'newuser', password: 'newpass' };
  
  fetch.mockResponseOnce(JSON.stringify(mockResponse));

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mockUser),
  };

  const response = await authService.register(mockUser);

  expect(response).toEqual(mockResponse);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/register`, requestOptions);
});

it('returns an error when register fails', async () => {
  const mockUser = { username: 'testuser', password: 'testpass' };
  const mockErrorResponse = { message: 'duplicate key value violates unique constraint "users_username_key"' };
  
  fetch.mockResponseOnce(JSON.stringify(mockErrorResponse), { status: 400 });

  const response = await authService.register(mockUser);

  expect(response.error).toEqual('Username already exists. Please choose a different username.');
  expect(fetch).toHaveBeenCalledTimes(1);
});
