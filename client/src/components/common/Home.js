import { useEffect, useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { formatTime } from '../../utils/formatTime';
import BuildingRow from '../building/BuildingRow';
import Box from '@mui/system/Box';
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import useDeleteBuilding from '../../hooks/buildings/useDeleteBuilding';
import { useFetchBuildingsWithTodayHours } from '../../hooks/buildings/useFetchBuildings';
import useFetchCoordinates from '../../hooks/coordinates/useFetchCoordinates';
import useFavoriteBuilding from '../../hooks/favorites/useFavoriteBuilding';

const Home = () => {
  const { userId, loggedIn } = useUser();
  const googleMapsApiKey = process.env.REACT_APP_GOOGLEMAPS_API_KEY;

  const [shownBuildingId, setShownBuildingId] = useState(null);
  const [search, setSearch] = useState("");
  const [isOpenToday, setIsOpenToday] = useState(false);
  const [buildings, setBuildings] = useState([]);

  const fetchBuildingsWithTodayHours = useFetchBuildingsWithTodayHours();
  const { deleteBuilding } = useDeleteBuilding();
  const coordinates = useFetchCoordinates(buildings, googleMapsApiKey);
  const { favorites, handleFavorite } = useFavoriteBuilding(userId, loggedIn);

  useEffect(() => {
    setBuildings(fetchBuildingsWithTodayHours);
  }, [fetchBuildingsWithTodayHours]);

  const handleDeleteBuilding = async (id) => {
    const deletedId = await deleteBuilding(id);
    if (deletedId) {
      setBuildings(buildings.filter((building) => building.id !== deletedId));
    }
  };

  const filteredBuildings = buildings
    ? buildings
      .filter((building) =>
        building.name.toLowerCase().includes(search.toLowerCase())
      )
      .filter((building) =>
        !isOpenToday || formatTime(building.open_time) !== "Closed"
      )
    : [];


  return (
    <Box sx={{ m: 3 }}>
      <TextField
        label="Search building by name"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        margin="normal"
      />

    <FormControlLabel
      control={
        <Checkbox
          id="isOpenToday"
          value="Open today"
          name="isOpenToday"
          checked={isOpenToday}
          onChange={(e) => setIsOpenToday(e.target.checked)}
        />
      }
      label="Open today"
    />

      <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th></th>
              <th>Today</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {filteredBuildings && filteredBuildings.length > 0 ? (
            filteredBuildings.map(building => (
              <BuildingRow
                key={building.id}
                building={building}
                favorites={favorites}
                handleFavorite={handleFavorite}
                shownBuildingId={shownBuildingId}
                setShownBuildingId={setShownBuildingId}
                loggedIn={loggedIn}
                coordinates={coordinates}
                onDelete={() => handleDeleteBuilding(building.id)}
              />
            ))
          ) : (
            <tr>
              <td colSpan="2">No buildings open today</td>
            </tr>
          )}
          </tbody>
        </table>
    </Box>
  );
}

export default Home;
