import { render, fireEvent, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useFetchBuildings } from '../../../hooks/buildings/useFetchBuildings';
import hoursService from '../../../services/hoursService';
import AddHours from '../../../components/hours/AddHours';

jest.mock('../../../hooks/buildings/useFetchBuildings');
jest.mock('../../../services/hoursService');

describe('AddHours component', () => {
  beforeEach(() => {
    useFetchBuildings.mockReturnValue([
      { id: "1", name: "Building 1" },
      { id: "2", name: "Building 2" },
    ]);

    hoursService.addHours = jest.fn().mockResolvedValue({});
  });

  test('the form fields are rendered correctly', () => {
    const { getByText, getByLabelText } = render(<AddHours />);

    expect(getByLabelText('Building')).toBeInTheDocument();
    expect(getByText('SUN')).toBeInTheDocument();
    expect(getByText('MON')).toBeInTheDocument();
    expect(getByText('TUE')).toBeInTheDocument();
    expect(getByText('WED')).toBeInTheDocument();
    expect(getByText('THU')).toBeInTheDocument();
    expect(getByText('FRI')).toBeInTheDocument();
    expect(getByText('SAT')).toBeInTheDocument();
    expect(getByText('Start Date')).toBeInTheDocument();
    expect(getByText('End Date')).toBeInTheDocument();
    expect(getByText('Open Time')).toBeInTheDocument();
    expect(getByText('Close Time')).toBeInTheDocument();
    expect(getByText('Add')).toBeInTheDocument();
  });

  it('renders correctly and submits form with single day', async () => {
    const { getAllByRole, getByRole, getByTestId, getByText } = render(<AddHours />);

    await act(async () => {
      fireEvent.mouseDown(getByTestId('building-select'));
      const listbox = within(getByRole('listbox'));
      fireEvent.click(listbox.getByText('/building/i'));

      fireEvent.click(getByText('MON'));
      fireEvent.change(getByTestId('start-date-input'), { target: { value: '2023-01-01' } });
      fireEvent.change(getByTestId('end-date-input'), { target: { value: '2023-12-31' } });
      fireEvent.change(getByTestId('open-time-input'), { target: { value: '08:00' } });
      fireEvent.change(getByTestId('close-time-input'), { target: { value: '18:00' } });
      fireEvent.click(getByText('Add'));
    });

    expect(hoursService.addHours).toHaveBeenCalled();
  });

  // it('renders correctly and submits form with multiple days', async () => {
  //   const { getByText, getByLabelText } = render(<AddHours />);

  //   await act(async () => {
  //     fireEvent.change(getByLabelText('Building'), { target: { value: '1' } });
  //     fireEvent.click(getByText('MON'));
  //     fireEvent.click(getByText('WED'));
  //     fireEvent.click(getByText('FRI'));
  //     fireEvent.change(getByLabelText('Start Date'), { target: { value: '2023-01-01' } });
  //     fireEvent.change(getByLabelText('End Date'), { target: { value: '2023-12-31' } });
  //     fireEvent.change(getByLabelText('Open Time'), { target: { value: '08:00' } });
  //     fireEvent.change(getByLabelText('Close Time'), { target: { value: '18:00' } });
  //     fireEvent.click(getByText('Add'));
  //   });

  //   expect(hoursService.addHours).toHaveBeenCalled();
  // });

  // test('shows error when no building is selected', async () => {
  //   const { getByText, findByText } = render(<AddHours />);
    
  //   await act(async () => {
  //     fireEvent.click(getByText('Add'));
  //   });
  
  //   expect(await findByText('Please fill in all fields. "buildingId" is missing.')).toBeInTheDocument();
  // });

  // test('shows error when no day of the week is selected', async () => {
  //   const { getByText, getByLabelText, findByText } = render(<AddHours />);
    
  //   await act(async () => {
  //     fireEvent.change(getByLabelText('Building'), { target: { value: '1' } });
  //     fireEvent.click(getByText('Add'));
  //   });
  
  //   expect(await findByText('Please fill in all fields. "dayOfWeek" is missing.')).toBeInTheDocument();
  // });

  // test('shows error when no start date is provided', async () => {
  //   const { getByText, getByLabelText, findByText } = render(<AddHours />);
    
  //   await act(async () => {
  //     fireEvent.change(getByLabelText('Building'), { target: { value: '1' } });
  //     fireEvent.click(getByText('MON'));
  //     fireEvent.change(getByLabelText('End Date'), { target: { value: '2023-12-31' } });
  //     fireEvent.change(getByLabelText('Open Time'), { target: { value: '08:00' } });
  //     fireEvent.change(getByLabelText('Close Time'), { target: { value: '18:00' } });
  //     fireEvent.click(getByText('Add'));
  //   });
  
  //   expect(await findByText('Please fill in all fields. "startDate" is missing.')).toBeInTheDocument();
  // });
  
  // test('shows error when no end date is provided', async () => {
  //   const { getByText, getByLabelText, findByText } = render(<AddHours />);
    
  //   await act(async () => {
  //     fireEvent.change(getByLabelText('Building'), { target: { value: '1' } });
  //     fireEvent.click(getByText('MON'));
  //     fireEvent.change(getByLabelText('Start Date'), { target: { value: '2023-01-01' } });
  //     fireEvent.change(getByLabelText('Open Time'), { target: { value: '08:00' } });
  //     fireEvent.change(getByLabelText('Close Time'), { target: { value: '18:00' } });
  //     fireEvent.click(getByText('Add'));
  //   });
  
  //   expect(await findByText('Please fill in all fields. "endDate" is missing.')).toBeInTheDocument();
  // });
  
  // test('shows error when no open time is provided', async () => {
  //   const { getByText, getByLabelText, findByText } = render(<AddHours />);
    
  //   await act(async () => {
  //     fireEvent.change(getByLabelText('Building'), { target: { value: '1' } });
  //     fireEvent.click(getByText('MON'));
  //     fireEvent.change(getByLabelText('Start Date'), { target: { value: '2023-01-01' } });
  //     fireEvent.change(getByLabelText('End Date'), { target: { value: '2023-12-31' } });
  //     fireEvent.change(getByLabelText('Close Time'), { target: { value: '18:00' } });
  //     fireEvent.click(getByText('Add'));
  //   });
  
  //   expect(await findByText('Please fill in all fields. "openTime" is missing.')).toBeInTheDocument();
  // });
  
  // test('shows error when no close time is provided', async () => {
  //   const { getByText, getByLabelText, findByText } = render(<AddHours />);
    
  //   await act(async () => {
  //     fireEvent.change(getByLabelText('Building'), { target: { value: '1' } });
  //     fireEvent.click(getByText('MON'));
  //     fireEvent.change(getByLabelText('Start Date'), { target: { value: '2023-01-01' } });
  //     fireEvent.change(getByLabelText('End Date'), { target: { value: '2023-12-31' } });
  //     fireEvent.change(getByLabelText('Open Time'), { target: { value: '08:00' } });
  //     fireEvent.click(getByText('Add'));
  //   });
  
  //   expect(await findByText('Please fill in all fields. "closeTime" is missing.')).toBeInTheDocument();
  // });

  // test('shows error when no building is selected', async () => {
  //   const { getByText, findByText } = render(<AddHours />);
    
  //   await act(async () => {
  //     fireEvent.click(getByText('Add'));
  //   });
  
  //   expect(await findByText("Please fill in all fields. \"buildingId\" is missing.")).toBeInTheDocument();
  // });
  
  // test('shows error when start date is later than end date', async () => {
  //   const { getByText, getByLabelText, findByText } = render(<AddHours />);
  
  //   await act(async () => {
  //     fireEvent.change(getByLabelText('Building'), { target: { value: '1' } });
  //     fireEvent.click(getByText('MON'));
  //     fireEvent.change(getByLabelText('Start Date'), { target: { value: '2023-12-31' } });
  //     fireEvent.change(getByLabelText('End Date'), { target: { value: '2023-01-01' } });
  //     fireEvent.change(getByLabelText('Open Time'), { target: { value: '08:00' } });
  //     fireEvent.change(getByLabelText('Close Time'), { target: { value: '18:00' } });
  //     fireEvent.click(getByText('Add'));
  //   });
  
  //   expect(await findByText("The start date cannot be later than the end date.")).toBeInTheDocument();
  // });
  
  // test('shows error when opening time is later than closing time', async () => {
  //   const { getByText, getByLabelText, findByText } = render(<AddHours />);
  
  //   await act(async () => {
  //     fireEvent.change(getByLabelText('Building'), { target: { value: '1' } });
  //     fireEvent.click(getByText('MON'));
  //     fireEvent.change(getByLabelText('Start Date'), { target: { value: '2023-01-01' } });
  //     fireEvent.change(getByLabelText('End Date'), { target: { value: '2023-12-31' } });
  //     fireEvent.change(getByLabelText('Open Time'), { target: { value: '18:00' } });
  //     fireEvent.change(getByLabelText('Close Time'), { target: { value: '08:00' } });
  //     fireEvent.click(getByText('Add'));
  //   });
  
  //   expect(await findByText("The opening time cannot be later than the closing time.")).toBeInTheDocument();
  // });
  

});
