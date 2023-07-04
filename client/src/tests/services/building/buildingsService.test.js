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
