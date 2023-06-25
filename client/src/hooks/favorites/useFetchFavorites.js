import { useState, useEffect } from 'react';
import favoritesService from '../../services/favoritesService';

const useFetchFavorites = (userId) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (userId) {
      favoritesService.getFavorites(userId)
        .then((data) => {
          setFavorites(data);
        })
        .catch((err) => {
          console.log("Error fetching favorites:", err);
        });
    }
  }, [userId]);

  return favorites;
};

export default useFetchFavorites;
