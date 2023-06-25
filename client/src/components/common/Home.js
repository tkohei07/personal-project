import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { formatTime } from '../../utils/formatTime';
import BuildingRow from '../building/BuildingRow';
import CheckBox from "../form/Checkbox";
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
      <div>
        <input
          type="text"
          placeholder="Search building by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control mb-3"
        />
    
        <CheckBox
          id="isOpenToday"
          value="Open today"
          name="isOpenToday"
          checked={isOpenToday}
          onChange={(e) => setIsOpenToday(e.target.checked)}
        />
    
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Building</th>
              <th>Today</th>
              <th>Rating</th>
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
      </div>
    )
    
}

export default Home;
