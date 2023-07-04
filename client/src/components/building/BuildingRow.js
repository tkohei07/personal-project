import { Link } from 'react-router-dom';
import { IconButton, TableCell, TableRow, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { FaStar, FaHeart, FaRegHeart, FaAngleDown, FaAngleUp } from "react-icons/fa";
import Rating from "react-rating";
import BuildingDetails from './BuildingDetails';
import { formatTime } from '../../utils/formatTime';

const BuildingRow = ({ building, favorites, handleFavorite, shownBuildingId, setShownBuildingId, loggedIn, coordinates, onDelete }) => {
  return (
    <>
      <TableRow key={building.id}>
        <TableCell>
          <Link to={building.link}>
            <Typography variant="body1">
              {building.name}
            </Typography>
          </Link>
        </TableCell>

        <TableCell>
          {
            formatTime(building.open_time) === "Closed" 
            ? "Closed"
            : `${formatTime(building.open_time)} - ${formatTime(building.close_time)}`
          }
          <IconButton component={Link} to={`/hours/${building.id}`} color="primary">
            <MoreHorizIcon />
          </IconButton>
        </TableCell>

        <TableCell>
          <Rating
            initialRating={building.ave_rating}
            emptySymbol={<FaStar color="gray" />}
            fullSymbol={<FaStar color="gold" />}
            readonly
          />
          <IconButton component={Link} to={`/reviews/${building.id}`} color="primary">
            <MoreHorizIcon />
          </IconButton>
        </TableCell>

        <TableCell>
          {loggedIn && (
            <IconButton onClick={() => handleFavorite(building.id)}>
              {favorites && favorites.some(favorite => favorite.buildingId === building.id) ? <FaHeart /> : <FaRegHeart />}
            </IconButton>
          )}
        </TableCell>

        <TableCell>
          <IconButton onClick={() => setShownBuildingId(shownBuildingId === building.id ? null : building.id)}>
            {shownBuildingId === building.id ? <FaAngleUp /> : <FaAngleDown />}
          </IconButton>
        </TableCell>
      </TableRow>

      {shownBuildingId === building.id && (
        <TableRow>
          <TableCell colSpan="5">
            <BuildingDetails
              building={building}
              coordinates={coordinates}
              onDelete={onDelete}
              loggedIn={loggedIn}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

export default BuildingRow;
