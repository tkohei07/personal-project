import { render, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { useFetchBuildingById } from '../../../hooks/buildings/useFetchBuildings';
import { useFetchHours } from '../../../hooks/hours/useFetchHours';
import useDeleteHour from '../../../hooks/hours/useDeleteHour';
import Hours from '../../../components/hours/Hours';
import { useUser } from '../../../contexts/UserContext';
import * as timeAndDate from '../../../constants/timeAndDate';

jest.mock('../../../hooks/buildings/useFetchBuildings');
jest.mock('../../../hooks/hours/useFetchHours');
jest.mock('../../../hooks/hours/useDeleteHour');
jest.mock('../../../contexts/UserContext');
jest.mock('../../../constants/timeAndDate');

describe('Hours component', () => {
  beforeEach(() => {
    useFetchBuildingById.mockReturnValue({building: {name: "Building 1"}});
    useFetchHours.mockReturnValue({hours: [
      { id: "1", startDate: "2023-01-01", endDate: "2023-12-31", openTimeStr: "08:00", closeTimeStr: "18:00", dayOfWeek: 1 },
      { id: "2", startDate: "2023-01-02", endDate: "2023-12-31", openTimeStr: "10:00", closeTimeStr: "20:00", dayOfWeek: 2 }
    ]});
    useDeleteHour.mockReturnValue({deleteHour: jest.fn()});
    useUser.mockReturnValue({loggedIn: true});
    timeAndDate.daysOfWeek = [
      {id: 1, label: "MON"},
      {id: 2, label: "TUE"}
    ];
  });

  test('renders building name correctly', () => {
    const { getByText } = render(<MemoryRouter initialEntries={["/hours/1"]}><Hours /></MemoryRouter>);
    expect(getByText('Hours: Building 1')).toBeInTheDocument();
  });

  test('renders hours table correctly', () => {
    const { getByText } = render(<MemoryRouter initialEntries={["/hours/1"]}><Hours /></MemoryRouter>);
    expect(getByText('1/1/2023-12/31/2023')).toBeInTheDocument();
    expect(getByText('1/2/2023-12/31/2023')).toBeInTheDocument();
    expect(getByText('8:00 AM-6:00 PM')).toBeInTheDocument();
    expect(getByText('10:00 AM-8:00 PM')).toBeInTheDocument();
    expect(getByText('MON')).toBeInTheDocument();
    expect(getByText('TUE')).toBeInTheDocument();
  });

  test('renders message when there are no hours', () => {
    useFetchHours.mockReturnValue({ hours: [] });
    
    const { getByText } = render(<MemoryRouter initialEntries={["/hours/1"]}><Hours /></MemoryRouter>);
    
    expect(getByText('No hours for this building.')).toBeInTheDocument();
  });

  test('delete button calls deleteHour function', async () => {
    const { getAllByText } = render(<MemoryRouter initialEntries={["/hours/1"]}><Hours /></MemoryRouter>);
    const deleteButtons = getAllByText('Delete');
    
    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });
  
    expect(useDeleteHour).toHaveBeenCalledTimes(deleteButtons.length);
    
  });
  
});
