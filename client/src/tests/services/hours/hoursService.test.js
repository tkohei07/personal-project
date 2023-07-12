import hoursService from '../../../services/hoursService';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

describe('hoursService', () => {
  it('fetches hours', async () => {
    const id = 1;
    const mockResponse = { id: 1, hours: '09:00-18:00' };

    fetch.mockResponseOnce(JSON.stringify(mockResponse));

    const hours = await hoursService.fetchHours(id);

    expect(hours).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/hours/${id}`);
  });

  it('throws error when fetching hours fails', async () => {
    const id = 1;
    const mockResponse = { error: 'Not found' };

    fetch.mockRejectOnce(new Error('Not found'));

    await expect(hoursService.fetchHours(id)).rejects.toThrow('Not found');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/hours/${id}`);
  });

  it('adds hours', async () => {
    const hoursObject = { id: 1, hours: '09:00-18:00' };
    const mockResponse = { id: 1, hours: '09:00-18:00' };

    fetch.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await hoursService.addHours(hoursObject);

    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/add-hours`, expect.any(Object));
  });

  it('throws error when adding hours fails', async () => {
    const hoursObject = { id: 1, hours: '09:00-18:00' };

    fetch.mockRejectOnce(new Error('Failed to add hours'));

    await expect(hoursService.addHours(hoursObject)).rejects.toThrow('Failed to add hours');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/add-hours`, expect.any(Object));
  });

  it('deletes hour', async () => {
    const id = 1;

    fetch.mockResponseOnce(JSON.stringify({}));

    await hoursService.deleteHour(id);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/hours/${id}`, expect.any(Object));
  });

  it('throws error when deleting hour fails', async () => {
    const id = 1;

    fetch.mockRejectOnce(new Error('Failed to delete hour'));

    await expect(hoursService.deleteHour(id)).rejects.toThrow('Failed to delete hour');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/hours/${id}`, expect.any(Object));
  });
});
