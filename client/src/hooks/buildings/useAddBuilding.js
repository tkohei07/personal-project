import { useState } from "react";
import buildingsService from '../../services/buildingsService';

const useAddBuilding = () => {
  const [error, setError] = useState(null);
  const [building, setBuilding] = useState({
    id: 0,
    name: "",
    address: "",
    link: "",
    isComputerRoom: false,
    isReservableStudyRoom: false,
    isVendingArea: false,
  });
  const [isBuildingAdded, setIsBuildingAdded] = useState(false); // new state

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBuilding({ ...building, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setBuilding({ ...building, [name]: checked });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await buildingsService.addBuilding(building);
      setBuilding({
        id: 0,
        name: "",
        address: "",
        link: "",
        isComputerRoom: false,
        isReservableStudyRoom: false,
        isVendingArea: false,
      });
      setError(null);
      // set it to true after a successful addition
      setIsBuildingAdded(true); 
    } catch (err) {
      setError(err.message);
    }
  };

  return { building, handleChange, handleCheckboxChange, handleSubmit, error, isBuildingAdded };
};


export default useAddBuilding;
