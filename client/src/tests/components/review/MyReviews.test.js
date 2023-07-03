import { render, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import { useFetchReviewsByUserId } from '../../../hooks/reviews/useFetchReviews';
import useDeleteReview from '../../../hooks/reviews/useDeleteReview';
import MyReviews from '../../../components/review/MyReviews';


jest.mock('../../../contexts/UserContext');
jest.mock('../../../hooks/reviews/useFetchReviews');
jest.mock('../../../hooks/reviews/useDeleteReview');

describe('MyReviews component', () => {
  beforeEach(() => {
    useUser.mockReturnValue({userId: "123"});
    useFetchReviewsByUserId.mockReturnValue([
      { id: "1", rating: 5, comment: "Great!", buildingName: "Building 1", updatedAt: new Date().toISOString() },
      { id: "2", rating: 4, comment: "Good!", buildingName: "Building 2", updatedAt: new Date().toISOString() }
    ]);    
    useDeleteReview.mockReturnValue({deleteReview: jest.fn()});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders review list correctly', () => {
    const { getByText } = render(<MemoryRouter><MyReviews /></MemoryRouter>);
    expect(getByText('Review for Building 1')).toBeInTheDocument();
    expect(getByText('Review for Building 2')).toBeInTheDocument();
    expect(getByText('Great!')).toBeInTheDocument();
    expect(getByText('Good!')).toBeInTheDocument();
  });

  test('renders message when there are no reviews', () => {
    useFetchReviewsByUserId.mockReturnValue([]);
    
    const { getByText } = render(<MemoryRouter><MyReviews /></MemoryRouter>);
    
    expect(getByText('You haven\'t made any reviews yet.')).toBeInTheDocument();
  });

  test('delete button calls deleteReview function', async () => {
    const { getAllByRole } = render(<MemoryRouter><MyReviews /></MemoryRouter>);
    const deleteButtons = getAllByRole('button');
    
    for (let i = 0; i < deleteButtons.length; i++) {
      await act(async () => {
        fireEvent.click(deleteButtons[i]);
      });
    }
  
    // Check that deleteReview was called once for each button click
    expect(useDeleteReview().deleteReview).toHaveBeenCalledTimes(deleteButtons.length);
    });
});
