import buildingsService from '../../../services/buildingsService';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

it('returns all buildings when getAllBuildings is called', async () => {
  fetch.mockResponseOnce(JSON.stringify([
    { 
      id: 1, 
      name: 'Building 1',
      address: 'Address 1',
      link: 'www.building1.com',
      isComputerRoom: true,
      isReservableStudyRoom: false,
      isVendingArea: true
    },
    { 
      id: 2, 
      name: 'Building 2',
      address: 'Address 2',
      link: 'www.building2.com',
      isComputerRoom: false,
      isReservableStudyRoom: true,
      isVendingArea: false
    },
  ]));

  const buildings = await buildingsService.getAllBuildings();

  expect(buildings).toEqual([
    { 
      id: 1, 
      name: 'Building 1',
      address: 'Address 1',
      link: 'www.building1.com',
      isComputerRoom: true,
      isReservableStudyRoom: false,
      isVendingArea: true
    },
    { 
      id: 2, 
      name: 'Building 2',
      address: 'Address 2',
      link: 'www.building2.com',
      isComputerRoom: false,
      isReservableStudyRoom: true,
      isVendingArea: false
    },
  ]);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/all-buildings`);
});

it('returns an error when the server responds with an error in getAllBuildings', async () => {
  const errorMessage = 'Failed to fetch';
  fetch.mockRejectOnce(new Error(errorMessage));

  const consoleErrorOriginal = console.error;
  console.error = jest.fn();

  try {
    await buildingsService.getAllBuildings();
  } catch (error) {
    expect(error.message).toBe(errorMessage);
  }

  console.error = consoleErrorOriginal; // Restore console.error

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/all-buildings`);
});

it('returns a building when fetchBuildingById is called', async () => {
  const mockBuilding = { 
    id: 1, 
    name: 'Building 1',
    address: 'Address 1',
    link: 'www.building1.com',
    isComputerRoom: true,
    isReservableStudyRoom: false,
    isVendingArea: true
  };
  fetch.mockResponseOnce(JSON.stringify(mockBuilding));

  const building = await buildingsService.fetchBuildingById(1);

  expect(building).toEqual(mockBuilding);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/building/1`);
});

it('returns an error when the server responds with an error in fetchBuildingById', async () => {
  const errorMessage = 'Failed to fetch';
  fetch.mockRejectOnce(new Error(errorMessage));

  const consoleErrorOriginal = console.error;
  console.error = jest.fn();

  try {
    await buildingsService.fetchBuildingById(1);
  } catch (error) {
    expect(error.message).toBe(errorMessage);
  }

  console.error = consoleErrorOriginal;

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/building/1`);
});

it('adds a new building when addBuilding is called', async () => {
  const newBuilding = {
    name: 'New Building',
    address: 'New Address',
    link: 'www.newbuilding.com',
    isComputerRoom: true,
    isReservableStudyRoom: false,
    isVendingArea: false
  };
  fetch.mockResponseOnce(JSON.stringify(newBuilding));

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newBuilding),
  };

  const building = await buildingsService.addBuilding(newBuilding);

  expect(building).toEqual(newBuilding);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/buildings`, requestOptions);
});

it('returns an error when the server responds with an error in addBuilding', async () => {
  const errorMessage = 'Failed to fetch';
  fetch.mockRejectOnce(new Error(errorMessage));

  const newBuilding = {
    name: 'New Building',
    address: 'New Address',
    link: 'www.newbuilding.com',
    isComputerRoom: true,
    isReservableStudyRoom: false,
    isVendingArea: false
  };

  const consoleErrorOriginal = console.error;
  console.error = jest.fn();

  try {
    await buildingsService.addBuilding(newBuilding);
  } catch (error) {
    expect(error.message).toBe(errorMessage);
  }

  console.error = consoleErrorOriginal;

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/buildings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newBuilding),
  });
});

it('returns buildings with today hours when fetchBuildingsWithTodayHours is called', async () => {
  const mockBuildingsWithTodayHours = [
    {
      id: 1,
      name: 'Building 1',
      address: 'Address 1',
      link: 'www.building1.com',
      isComputerRoom: true,
      isReservableStudyRoom: false,
      isVendingArea: true,
      open_time: '09:00',
      close_time: '17:00',
      ave_rating: 4.5
    },
    {
      id: 2,
      name: 'Building 2',
      address: 'Address 2',
      link: 'www.building2.com',
      isComputerRoom: false,
      isReservableStudyRoom: true,
      isVendingArea: true,
      open_time: '11:00',
      close_time: '19:00',
      ave_rating: 2.5
    },
  ];

  fetch.mockResponseOnce(JSON.stringify(mockBuildingsWithTodayHours));

  const buildings = await buildingsService.fetchBuildingsWithTodayHours();

  expect(buildings).toEqual(mockBuildingsWithTodayHours);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/buildings`);
});


it('returns an error when the server responds with an error in fetchBuildingsWithTodayHours', async () => {
  const errorMessage = 'Failed to fetch';
  fetch.mockRejectOnce(new Error(errorMessage));

  const consoleErrorOriginal = console.error;
  console.error = jest.fn();

  try {
    await buildingsService.fetchBuildingsWithTodayHours();
  } catch (error) {
    expect(error.message).toBe(errorMessage);
  }

  console.error = consoleErrorOriginal;

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/buildings`);
});

it('updates a building when updateBuilding is called', async () => {
  const updatedBuilding = {
    id: 1,
    name: 'Updated Building',
    address: 'Updated Address',
    link: 'www.updatedbuilding.com',
    isComputerRoom: false,
    isReservableStudyRoom: true,
    isVendingArea: true
  };

  fetch.mockResponseOnce(JSON.stringify(updatedBuilding));

  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedBuilding),
  };

  const building = await buildingsService.updateBuilding(1, updatedBuilding);

  expect(building).toEqual(updatedBuilding);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/building/1`, requestOptions);
});

it('throws an error when updateBuilding fails', async () => {
  const errorMessage = 'Failed to update building';
  fetch.mockRejectOnce(new Error(errorMessage));

  const consoleErrorOriginal = console.error;
  console.error = jest.fn();

  try {
    await buildingsService.updateBuilding(1, {});
  } catch (error) {
    expect(error.message).toBe(errorMessage);
  }

  console.error = consoleErrorOriginal;

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/building/1`, expect.any(Object));
});

it('deletes a building when deleteBuilding is called', async () => {
  fetch.mockResponseOnce();

  const idToDelete = 1;
  const deletedId = await buildingsService.deleteBuilding(idToDelete);

  expect(deletedId).toBe(idToDelete);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/buildings/1`, expect.any(Object));
});

it('throws an error when deleteBuilding fails', async () => {
  const errorMessage = 'Failed to delete building.';
  fetch.mockRejectOnce(new Error(errorMessage));

  try {
    await buildingsService.deleteBuilding(1);
  } catch (error) {
    expect(error.message).toBe(errorMessage);
  }

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND}/api/buildings/1`, expect.any(Object));
});
