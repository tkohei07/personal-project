import { useState, useEffect } from 'react';
import favoritesService from '../../services/favoritesService';
import useFetchFavorites from './useFetchFavorites';

const useFavoriteBuilding = (userId, loggedIn) => {
  const initialFavorites = useFetchFavorites(userId);
  const [favorites, setFavorites] = useState(initialFavorites);

  useEffect(() => {
    setFavorites(initialFavorites);
  }, [initialFavorites]);

  const handleFavorite = async (buildingId) => {
    if (loggedIn) {
      const favoritesIds = favorites ? favorites.map(favorite => favorite.buildingId) : [];
      const method = favoritesIds.includes(buildingId) ? "DELETE" : "POST";

      const data = await favoritesService.toggleFavorite(userId, buildingId, method);
      
      if (data.error) {
        console.log("Error changing favorite:", data.error);
      } else {
        if (favoritesIds.includes(buildingId)) {
          setFavorites(favorites.filter(favorite => favorite.buildingId !== buildingId));
        } else {
          setFavorites([...favorites, { userId: userId, buildingId: buildingId }]);
        }
      }
    }
  };

  return { favorites, handleFavorite };
};

export default useFavoriteBuilding;
