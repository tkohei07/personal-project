import { useState, useEffect } from 'react';
import buildingsService from '../../services/buildingsService';

const useFetchBuildingsWithTodayHours = () => {
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    buildingsService.fetchBuildingsWithTodayHours()
      .then((data) => setBuildings(data))
  }, []);

  return buildings;
}

const useFetchBuildings = () => {
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    buildingsService.getAllBuildings()
      .then(setBuildings)
  }, []);
  
  return buildings;
};

const useFetchBuildingById = (buildingId) => {
  const [building, setBuilding] = useState([]);
  
  useEffect(() => {
    buildingsService.fetchBuildingById(buildingId)
      .then(data => setBuilding(data))

  }, [buildingId]);

  return { building, setBuilding };
};

export { useFetchBuildingsWithTodayHours, useFetchBuildings, useFetchBuildingById };
