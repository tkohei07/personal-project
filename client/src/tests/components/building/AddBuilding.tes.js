import { render, fireEvent } from '@testing-library/react';
import useAddBuilding from '../../../hooks/buildings/useAddBuilding';
import AddBuilding from '../../../components/building/AddBuilding';

jest.mock('../../../hooks/buildings/useAddBuilding');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), 
  useNavigate: () => jest.fn(), 
}));

describe('AddBuilding component', () => {
  let mockHandleSubmit;
  beforeEach(() => {
    mockHandleSubmit = jest.fn(e => e.preventDefault());

    useAddBuilding.mockReturnValue({
      building: { 
        name: "", 
        address: "", 
        link: "", 
        isComputerRoom: false, 
        isReservableStudyRoom: false, 
        isVendingArea: false 
      },
      handleChange: jest.fn(),
      handleCheckboxChange: jest.fn(),
      handleSubmit: mockHandleSubmit,
      error: null,
      isBuildingAdded: true,
    });

  });

  test('the form fields are rendered correctly', () => {
    const { getByText } = render(<AddBuilding />);

    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('Address')).toBeInTheDocument();
    expect(getByText('Link')).toBeInTheDocument();
    expect(getByText('Computer Room')).toBeInTheDocument();
    expect(getByText('Reservable Study Room')).toBeInTheDocument();
    expect(getByText('Vending Area')).toBeInTheDocument();
    expect(getByText('Add')).toBeInTheDocument();
  });
  
  it('renders correctly and submits form', async () => {
    const { getByText, getByLabelText } = render(<AddBuilding />);

    fireEvent.change(getByLabelText('Name'), { target: { value: 'Test Building' } });
    fireEvent.change(getByLabelText('Address'), { target: { value: '123 Main St' } });
    fireEvent.change(getByLabelText('Link'), { target: { value: 'http://test.com' } });
    fireEvent.click(getByText('Computer Room'));
    fireEvent.click(getByText('Reservable Study Room'));
    fireEvent.click(getByText('Vending Area'));
    fireEvent.click(getByText('Add'));

    expect(mockHandleSubmit).toHaveBeenCalled();

  });

  //// TODO: Fix this test
  // test('name field is required', () => {
  //   const { getByText, getByLabelText } = render(<AddBuilding />);

  //   // Do not change 'Name' field to simulate it being left empty
  //   fireEvent.change(getByLabelText('Address'), { target: { value: '123 Main St' } });
  //   fireEvent.change(getByLabelText('Link'), { target: { value: 'http://test.com' } });
  //   fireEvent.click(getByText('Computer Room'));
  //   fireEvent.click(getByText('Reservable Study Room'));
  //   fireEvent.click(getByText('Vending Area'));
  //   fireEvent.click(getByText('Add'));

  //   // The form submit handler should not be called if 'Name' is required and left empty
  //   expect(mockHandleSubmit).not.toHaveBeenCalled();
  // });
  
});
