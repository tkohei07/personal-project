import { useState, useEffect } from 'react';
import coordinatesService from '../../services/coordinatesService';

const useFetchCoordinates = (buildings, googleMapsApiKey) => {
  const [coordinates, setCoordinates] = useState({});

  useEffect(() => {
    const fetchCoordinates = async () => {
      const coords = {};
      for (const building of buildings) {
        const location = await coordinatesService.fetchCoordinates(building.address, googleMapsApiKey);
        if (location) {
          coords[building.id] = location;
        }
      }
      setCoordinates(coords);
    };

    fetchCoordinates();
  }, [buildings, googleMapsApiKey]);

  return coordinates;
};

export default useFetchCoordinates;
