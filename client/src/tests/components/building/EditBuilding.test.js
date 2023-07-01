import { render, fireEvent } from '@testing-library/react';
import EditBuilding from '../../../components/building/EditBuilding';
import { useFetchBuildingById } from '../../../hooks/buildings/useFetchBuildings';
import useUpdateBuilding from '../../../hooks/buildings/useUpdateBuilding';

jest.mock('../../../hooks/buildings/useFetchBuildings');
jest.mock('../../../hooks/buildings/useUpdateBuilding');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), 
  useNavigate: () => jest.fn(), 
}));

describe('EditBuilding component', () => {
  let mockSetBuilding;
  let mockUpdateBuilding;

  beforeEach(() => {
    mockSetBuilding = jest.fn();
    mockUpdateBuilding = jest.fn();

    useFetchBuildingById.mockReturnValue({
      building: {
        name: "Old Building",
        address: "456 Old St",
        link: "http://old.com",
        isComputerRoom: true,
        isReservableStudyRoom: true,
        isVendingArea: true
      },
      setBuilding: mockSetBuilding,
      error: null
    });

    useUpdateBuilding.mockReturnValue({
      updateBuilding: mockUpdateBuilding
    });
  });

  test('the form fields are rendered correctly', () => {
    const { getByText } = render(<EditBuilding />);

    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('Address')).toBeInTheDocument();
    expect(getByText('Link')).toBeInTheDocument();
    expect(getByText('Computer Room')).toBeInTheDocument();
    expect(getByText('Reservable Study Room')).toBeInTheDocument();
    expect(getByText('Vending Area')).toBeInTheDocument();
    expect(getByText('Submit')).toBeInTheDocument();
  });

  it('renders correctly and submits form', async () => {
    const { getByText, getByLabelText } = render(<EditBuilding />);

    fireEvent.change(getByLabelText('Name'), { target: { value: 'New Building' } });
    fireEvent.change(getByLabelText('Address'), { target: { value: '789 New St' } });
    fireEvent.change(getByLabelText('Link'), { target: { value: 'http://new.com' } });
    fireEvent.click(getByText('Computer Room'));
    fireEvent.click(getByText('Reservable Study Room'));
    fireEvent.click(getByText('Vending Area'));
    fireEvent.click(getByText('Submit'));

    expect(mockUpdateBuilding).toHaveBeenCalled();
  });
  
});
