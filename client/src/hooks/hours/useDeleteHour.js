import { useState } from "react";
import hoursService from '../../services/hoursService';

const useDeleteHour = () => {
  const [error, setError] = useState(null);

  const deleteHour = async (id, hours, setHours) => {
    try {
      await hoursService.deleteHour(id);
      setHours(hours.filter((hour) => hour.id !== id));
    } catch (err) {
      console.error('Error deleting hour:', err);
      setError(err.message || 'Failed to delete hour.');
    }
  };

  return { deleteHour, error };
};

export default useDeleteHour;
