import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { useUser } from '../../../contexts/UserContext';
import { useFetchBuildingsWithTodayHours } from '../../../hooks/buildings/useFetchBuildings';
import useDeleteBuilding from '../../../hooks/buildings/useDeleteBuilding';
import useFavoriteBuilding from '../../../hooks/favorites/useFavoriteBuilding';
import Home from '../../../components/common/Home';

jest.mock('../../../contexts/UserContext');
jest.mock('../../../hooks/buildings/useFetchBuildings');
jest.mock('../../../hooks/buildings/useDeleteBuilding');
jest.mock('../../../hooks/favorites/useFavoriteBuilding');
jest.mock('../../../hooks/coordinates/useFetchCoordinates', () => {
  return jest.fn();
});

describe('Home component', () => {
  beforeEach(() => {
    useUser.mockReturnValue({ userId: "1", loggedIn: true });
    // I cannot understand the reason but the time format is below according to the log.
    useFetchBuildingsWithTodayHours.mockReturnValue([
      { id: "1", name: "Building 1", open_time: {String: '08:00:00', Valid: true}, close_time: {String: '20:00:00', Valid: true},
        isComputerRoom: true, isReservableStudyRoom: true,  isVendingArea: true},
      { id: "2", name: "Building 2", open_time: "Closed" },
    ]);
    useDeleteBuilding.mockReturnValue({ deleteBuilding: jest.fn() });
    useFavoriteBuilding.mockReturnValue({ favorites: [], handleFavorite: jest.fn() });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('the form fields are rendered correctly', () => {
    const { getByPlaceholderText, getByLabelText, getByText } = render(<MemoryRouter><Home /></MemoryRouter>);
    expect(getByPlaceholderText('Search building by name')).toBeInTheDocument();
    expect(getByLabelText('Open today')).toBeInTheDocument();
    expect(getByText('Building')).toBeInTheDocument();
    expect(getByText('Today')).toBeInTheDocument();
    expect(getByText('Rating')).toBeInTheDocument();
  });

  test('the row data is rendered correctly', () => {
    const { getByText } = render(<MemoryRouter><Home /></MemoryRouter>);
    expect(getByText('Building 1')).toBeInTheDocument();
    expect(getByText('Building 2')).toBeInTheDocument();
    expect(getByText('8:00 am - 8:00 pm')).toBeInTheDocument();
    expect(getByText('Closed')).toBeInTheDocument();
  });

  test('search box filters buildings correctly', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<MemoryRouter><Home /></MemoryRouter>);
  
    // All buildings should be visible at first
    expect(getByText('Building 1')).toBeInTheDocument();
    expect(getByText('Building 2')).toBeInTheDocument();
  
    // After entering a search term, only the matching buildings should be visible
    fireEvent.change(getByPlaceholderText('Search building by name'), { target: { value: '1' } });
  
    expect(getByText('Building 1')).toBeInTheDocument();
    expect(queryByText('Building 2')).toBeNull();
  });  

  test('"Open today" checkbox filters buildings correctly', () => {
  
    const { getByLabelText, getByText, queryByText } = render(<MemoryRouter><Home /></MemoryRouter>);
  
    // Both buildings should be visible at first
    expect(getByText('Building 1')).toBeInTheDocument();
    expect(getByText('Building 2')).toBeInTheDocument();
  
    // After checking the checkbox, only the open building should be visible
    fireEvent.click(getByLabelText('Open today'));
    expect(getByText('Building 1')).toBeInTheDocument();
    expect(queryByText('Building 2')).toBeNull();
  });

  test('favorite button calls handleFavorite function', () => {
    const mockHandleFavorite = jest.fn();
    useFavoriteBuilding.mockReturnValue({ favorites: [], handleFavorite: mockHandleFavorite });
  
    const { getAllByRole } = render(<MemoryRouter><Home /></MemoryRouter>);
  
    // Get all buttons, then filter to get only the "favorite" buttons
    const buttons = getAllByRole('button');
    fireEvent.click(buttons[2]);
  
    // Check if the function was called
    expect(mockHandleFavorite).toHaveBeenCalledTimes(1);
  });

  // test('BuildingDetails is displayed when FaAngleDown is clicked', async () => {
  //   const { getByText, getAllByRole } = render(<MemoryRouter><Home /></MemoryRouter>);

  //   // Assume that the first button in each row is the FaAngleDown/FaAngleUp button.
  //   const angleButtons = getAllByRole('button');
  //   // console.log(angleButtons)
  //   fireEvent.click(angleButtons[3]);
    
  //   // expect(getByText('Computer Room')).toBeInTheDocument();
  //   await waitFor(() => {
  //     expect(getByText('Computer Room')).toBeInTheDocument();
  //   });
  // });
  
  // test('calls deleteBuilding function on delete', async () => {
  //   const { getAllByText } = render(<Home />);
  //   const deleteButtons = getAllByText('Delete');

  //   await act(async () => {
  //     fireEvent.click(deleteButtons[0]);
  //   });

  //   expect(useDeleteBuilding().deleteBuilding).toHaveBeenCalledTimes(1);
  // });
});
