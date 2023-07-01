import { render, fireEvent } from '@testing-library/react';
import { useUser } from '../../../contexts/UserContext';
import useFavoriteBuilding from '../../../hooks/favorites/useFavoriteBuilding';
import MyFavoriteBuildings from '../../../components/favorite/MyFavoriteBuildings';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../../../contexts/UserContext');
jest.mock('../../../hooks/favorites/useFavoriteBuilding');

describe('MyFavoriteBuildings component', () => {
  let mockHandleFavorite;

  beforeEach(() => {
    useUser.mockReturnValue({
      userId: "1",
      loggedIn: true
    });

    mockHandleFavorite = jest.fn();

    useFavoriteBuilding.mockReturnValue({
      favorites: [
        { buildingId: "1", buildingName: "Building 1" },
        { buildingId: "2", buildingName: "Building 2" },
      ],
      handleFavorite: mockHandleFavorite,
    });
  });

  it('renders favorite buildings correctly', () => {
    const { getByText } = render(
      <Router>
        <MyFavoriteBuildings />
      </Router>
    );

    expect(getByText('Building 1')).toBeInTheDocument();
    expect(getByText('Building 2')).toBeInTheDocument();
  });

  it('calls handleFavorite when heart icon is clicked', () => {
    const { getAllByLabelText } = render(
      <Router>
        <MyFavoriteBuildings />
      </Router>
    );
  
    const favoriteButtons = getAllByLabelText('favorite');

    fireEvent.click(favoriteButtons[0]);
    expect(mockHandleFavorite).toHaveBeenCalledWith("1");
    fireEvent.click(favoriteButtons[1]);
    expect(mockHandleFavorite).toHaveBeenCalledWith("2");


  });

  it('displays message when there are no favorite buildings', () => {
    useFavoriteBuilding.mockReturnValue({
      favorites: [], // return an empty array for favorites
      handleFavorite: mockHandleFavorite,
    });
  
    const { getByText } = render(
      <Router>
        <MyFavoriteBuildings />
      </Router>
    );
  
    expect(getByText('No favorite buildings found.')).toBeInTheDocument();
  });
});
