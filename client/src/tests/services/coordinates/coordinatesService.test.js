import coordinatesService from '../../../services/coordinatesService';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

it('fetches coordinates from Google Maps API', async () => {
  const mockResponse = {
    results: [
      {
        geometry: {
          location: {
            lat: 40.712776,
            lng: -74.005974,
          },
        },
      },
    ],
  };
  const address = 'New York';
  const googleMapsApiKey = 'YourAPIKeyHere';
  
  fetch.mockResponseOnce(JSON.stringify(mockResponse));

  const location = await coordinatesService.fetchCoordinates(address, googleMapsApiKey);

  expect(location).toEqual(mockResponse.results[0].geometry.location);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMapsApiKey}`);
});

it('returns null and logs an error when the Google Maps API call fails', async () => {
  const errorMessage = 'Failed to fetch';
  fetch.mockRejectOnce(new Error(errorMessage));

  const consoleErrorOriginal = console.error;
  console.error = jest.fn();

  const address = 'New York';
  const googleMapsApiKey = 'YourAPIKeyHere';
  
  const location = await coordinatesService.fetchCoordinates(address, googleMapsApiKey);

  expect(location).toBeNull();
  expect(console.error).toHaveBeenCalledWith('Failed to fetch coordinates: ', new Error(errorMessage));
  
  console.error = consoleErrorOriginal; // Restore console.error

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMapsApiKey}`);
});

it('returns null when there are no results from the Google Maps API call', async () => {
  const mockResponse = { results: [] };
  const address = 'Invalid Address';
  const googleMapsApiKey = 'YourAPIKeyHere';

  fetch.mockResponseOnce(JSON.stringify(mockResponse));

  const location = await coordinatesService.fetchCoordinates(address, googleMapsApiKey);

  expect(location).toBeNull();
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMapsApiKey}`);
});
