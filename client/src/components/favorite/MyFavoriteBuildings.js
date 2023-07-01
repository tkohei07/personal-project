import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useUser } from '../../contexts/UserContext';
import useFavoriteBuilding from '../../hooks/favorites/useFavoriteBuilding';

const MyFavoriteBuildings = () => {
  const { userId, loggedIn } = useUser();
  const { favorites, handleFavorite } = useFavoriteBuilding(userId, loggedIn);

  return (
    <div>
      <h2>Favorite Buildings</h2>
      <hr />
      <ul>
        {favorites && favorites.length > 0 ? (
          favorites.map((favorite) => (
            <li key={favorite.buildingId}>
              <Link to={`/building/${favorite.buildingId}`}>
                {favorite.buildingName}
              </Link>
              <button aria-label="favorite" onClick={() => handleFavorite(favorite.buildingId)} className="favorite-icon">
                <FaHeart />
              </button>
            </li>
          ))
        ) : (
          <p>No favorite buildings found.</p>
        )}
      </ul>
    </div>
  );
}

export default MyFavoriteBuildings;
