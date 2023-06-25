import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart, FaAngleDown, FaAngleUp } from "react-icons/fa";
import Rating from "react-rating";
import BuildingDetails from './BuildingDetails';
import { formatTime } from '../../utils/formatTime';

const BuildingRow = ({ building, favorites, handleFavorite, shownBuildingId, setShownBuildingId, loggedIn, coordinates, onDelete }) => {
  return (
    <>
      <tr key={building.id}>
        <td>
          <Link to={`/buildings/${building.id}`}>
            {building.name}
          </Link>
        </td>

        <td>
          {
            formatTime(building.open_time) === "Closed" 
            ? "Closed"
            : `${formatTime(building.open_time)} - ${formatTime(building.close_time)}`
          }
          <Link to={`/hours/${building.id}`}>
            <button className="btn btn-sm btn-primary ml-2">
              more
            </button>
          </Link>
        </td>

        <td>
          <Rating
            initialRating={building.ave_rating}
            emptySymbol={<FaStar color="gray" />}
            fullSymbol={<FaStar color="gold" />}
            readonly
          />
          <Link to={`/reviews/${building.id}`}>
            <button className="btn btn-sm btn-primary ml-2">
              more
            </button>
          </Link>
        </td>

        <td>
          {loggedIn && (
            <button onClick={() => handleFavorite(building.id)} className="btn">
              {favorites && favorites.some(favorite => favorite.buildingId === building.id) ? <FaHeart /> : <FaRegHeart />}
            </button>
          )}
        </td>

        <td>
          <button onClick={() => setShownBuildingId(shownBuildingId === building.id ? null : building.id)}>
            {shownBuildingId === building.id ? <FaAngleUp /> : <FaAngleDown />}
          </button>
        </td>
      </tr>

      {shownBuildingId === building.id && (
        <tr>
          <td colSpan="5">
            <BuildingDetails
              building={building}
              coordinates={coordinates}
              onDelete={onDelete}
              loggedIn={loggedIn}
            />
          </td>
        </tr>
      )}
    </>
  )
}

export default BuildingRow;
