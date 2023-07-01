import { render, fireEvent } from '@testing-library/react';
import { useFetchBuildingById } from '../../../hooks/buildings/useFetchBuildings';
import useAddReview from '../../../hooks/reviews/useAddReview';
import { useUser } from '../../../contexts/UserContext';
import AddReview from '../../../components/review/AddReview';

jest.mock('../../../hooks/buildings/useFetchBuildings');
jest.mock('../../../hooks/reviews/useAddReview');
jest.mock('../../../contexts/UserContext');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), 
  useParams: () => ({ id: "1" }), 
}));

describe('AddReview component', () => {

  beforeEach(() => {
    useFetchBuildingById.mockReturnValue({
      building: { name: "Building 1" },
    });

    useUser.mockReturnValue({
      userId: "user1",
    });

    useAddReview.mockReturnValue({
      addReview: jest.fn((rating, comment) => {}),
      error: null,
    });
  });

  test('the form fields are rendered correctly', () => {
    const { getByText, getAllByLabelText, getByLabelText } = render(<AddReview />);

    expect(getByText('Review Building 1')).toBeInTheDocument();
    expect(getAllByLabelText(/^star-/).length).toBe(5);
    expect(getByLabelText('Comment:')).toBeInTheDocument();
    expect(getByText('Submit Review')).toBeInTheDocument();
  });
  
  it('renders correctly and submits form', () => {
    const { getByText, getByLabelText } = render(<AddReview />);
  
    const addReview = useAddReview().addReview;
  
    fireEvent.click(getByLabelText('star-4'));
    fireEvent.change(getByLabelText('Comment:'), { target: { value: 'Nice building.' } });
    fireEvent.click(getByText('Submit Review'));
  
    expect(addReview).toHaveBeenCalled();
  });

  // check the required fields (star rating)
  it('renders correctly and does not submit a rating', () => {
    const { getByText, getByLabelText } = render(<AddReview />);
  
    const addReview = useAddReview().addReview;
  
    fireEvent.change(getByLabelText('Comment:'), { target: { value: 'Nice building.' } });
    fireEvent.click(getByText('Submit Review'));
  
    expect(addReview).not.toHaveBeenCalled();
  })
  
});
