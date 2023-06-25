import { useState, useEffect } from 'react';
import hoursService from '../../services/hoursService';

const useFetchHours = (id) => {
  const [hours, setHours] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    hoursService.fetchHours(id)
      .then(data => setHours(data))
      .catch(setError);
  }, [id]);

  return { hours, error };
};

export { useFetchHours };
