import { useState } from 'react';
import buildingsService from '../../services/buildingsService';

const useUpdateBuilding = () => {
  const [error, setError] = useState(null);

  const updateBuilding = async (buildingId, buildingData) => {
    try {
      const data = await buildingsService.updateBuilding(buildingId, buildingData);
      return data;
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  return { updateBuilding, error };
};

export default useUpdateBuilding;
