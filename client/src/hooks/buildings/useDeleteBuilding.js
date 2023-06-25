import { useState } from 'react';
import buildingsService from '../../services/buildingsService';

const useDeleteBuilding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteBuilding = async (id) => {
    if (!window.confirm("Are you sure you want to delete this building? This will also delete all related information.")) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const deletedId = await buildingsService.deleteBuilding(id);
      setIsLoading(false);
      return deletedId;
    } catch (err) {
      setIsLoading(false);
      setError(err);
    }
  };

  return { deleteBuilding, isLoading, error };
};

export default useDeleteBuilding;
