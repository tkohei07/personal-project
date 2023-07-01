import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useFetchBuildingById } from '../../../hooks/buildings/useFetchBuildings';
import { useFetchReviewsByBuildingId } from '../../../hooks/reviews/useFetchReviews';
import Reviews from '../../../components/review/Reviews';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('../../../hooks/buildings/useFetchBuildings');
jest.mock('../../../hooks/reviews/useFetchReviews');

describe('Reviews component', () => {
  let tempDate = new Date();
  tempDate.setDate(tempDate.getDate() - 1);
  const pastDate = tempDate.toISOString();
  const pastLocalDate = new Date(pastDate).toLocaleDateString();

  const curDate = new Date().toISOString();
  const curLocalDate = new Date(curDate).toLocaleDateString();

  beforeEach(() => {
    useParams.mockReturnValue({ id: '1' });
    useFetchBuildingById.mockReturnValue({ 
      building: { name: 'Building 1' } 
    });
    useFetchReviewsByBuildingId.mockReturnValue([
      { id: '1', username: 'User1', rating: 5, comment: 'Great!', updatedAt: pastDate },
      { id: '2', username: 'User2', rating: 4, comment: 'Good!', updatedAt: curDate }
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders reviews correctly', () => {
    const { getByText } = render(<MemoryRouter><Reviews /></MemoryRouter>);
    expect(getByText('Reviews for Building 1')).toBeInTheDocument();
    expect(getByText('User1')).toBeInTheDocument();
    expect(getByText('User2')).toBeInTheDocument();
    expect(getByText('Great!')).toBeInTheDocument();
    expect(getByText('Good!')).toBeInTheDocument();
    expect(getByText(pastLocalDate)).toBeInTheDocument();
    expect(getByText(curLocalDate)).toBeInTheDocument();
    expect(getByText('Add Review')).toBeInTheDocument();
  });

  // navigate to "/" because not logged in
  // test("navigates to Add Review page on clicking Add Review link", () => {
  //   const history = createMemoryHistory();
  //   const { getByText } = render(
  //     <MemoryRouter>
  //       <Reviews />
  //     </MemoryRouter>
  //   );
  
  //   fireEvent.click(getByText("Add Review"));
  //   expect(history.location.pathname).toBe(`/add-review/1`);
  // });
});
