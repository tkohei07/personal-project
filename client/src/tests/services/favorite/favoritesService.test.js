import favoritesService from '../../../services/favoritesService';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

it('fetches user favorites', async () => {
  const userId = 1;
  const mockResponse = [
    { id: 1, name: 'Building 1' },
    { id: 2, name: 'Building 2' },
  ];

  fetch.mockResponseOnce(JSON.stringify(mockResponse));

  const favorites = await favoritesService.getFavorites(userId);

  expect(favorites).toEqual(mockResponse);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/user/${userId}/favorites`);
});

it('returns an empty array when the server responds with an error in getFavorites', async () => {
  const errorMessage = 'Failed to fetch';
  fetch.mockRejectOnce(new Error(errorMessage));

  const consoleLogOriginal = console.log;
  console.log = jest.fn();

  const userId = 1;
  const favorites = await favoritesService.getFavorites(userId);

  expect(favorites).toEqual([]);
  expect(console.log).toHaveBeenCalledWith('Error fetching favorites:', new Error(errorMessage));
  
  console.log = consoleLogOriginal; // Restore console.log

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/user/${userId}/favorites`);
});

it('toggles favorite status of a building for a user', async () => {
  const userId = 1;
  const buildingId = 2;
  const method = "POST";
  const mockResponse = { status: "Success" };

  fetch.mockResponseOnce(JSON.stringify(mockResponse));

  const requestOptions = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      buildingId: buildingId,
    }),
  };

  const result = await favoritesService.toggleFavorite(userId, buildingId, method);

  expect(result).toEqual(mockResponse);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/user/${userId}/favorites`, requestOptions);
});

it('logs an error when the server responds with an error in toggleFavorite', async () => {
  const errorMessage = 'Failed to fetch';
  fetch.mockRejectOnce(new Error(errorMessage));

  const consoleLogOriginal = console.log;
  console.log = jest.fn();

  const userId = 1;
  const buildingId = 2;
  const method = "POST";

  try {
    await favoritesService.toggleFavorite(userId, buildingId, method);
  } catch (error) {
    expect(console.log).toHaveBeenCalledWith('Error changing favorite:', new Error(errorMessage));
  }

  console.log = consoleLogOriginal; // Restore console.log

  const requestOptions = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      buildingId: buildingId,
    }),
  };

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/user/${userId}/favorites`, requestOptions);
});
