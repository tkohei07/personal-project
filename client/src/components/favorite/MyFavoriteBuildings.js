import { Link as RouterLink } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useUser } from '../../contexts/UserContext';
import useFavoriteBuilding from '../../hooks/favorites/useFavoriteBuilding';
import Box from '@mui/system/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';

const MyFavoriteBuildings = () => {
  const { userId, loggedIn } = useUser();
  const { favorites, handleFavorite } = useFavoriteBuilding(userId, loggedIn);

  return (
    <Box sx={{ m: 3 }}>
      <Typography variant="h4" gutterBottom>
        Favorite Buildings
      </Typography>
      <hr />
      <List>
        {favorites && favorites.length > 0 ? (
          favorites.map((favorite) => (
            <ListItem key={favorite.buildingId}>
              <ListItemText
                primary={
                  <Typography variant="h6">
                    <RouterLink to={`/building/${favorite.buildingId}`}>
                      {favorite.buildingName}
                    </RouterLink>
                  </Typography>
                }
              />
              <ListItemSecondaryAction>
                <IconButton aria-label="favorite" onClick={() => handleFavorite(favorite.buildingId)}>
                  <FaHeart />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        ) : (
          <Typography variant="subtitle1">
            No favorite buildings found.
          </Typography>
        )}
      </List>
    </Box>
  );
}

export default MyFavoriteBuildings;
