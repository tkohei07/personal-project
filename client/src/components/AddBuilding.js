import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./form/Input";

const AddBuilding = () => {
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

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBuilding({ ...building, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setBuilding({ ...building, [name]: checked });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const buildingObject = {
      ...building,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildingObject),
    };

    fetch(`${process.env.REACT_APP_BACKEND}/api/buildings`, requestOptions)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          // Set the error state with the message from the backend
          setError(`Failed to add building: ${data.error}`);
          return;
        }

        console.log('Building added successfully');
        setBuilding({
          id: 0,
          name: "",
          address: "",
          link: "",
          isComputerRoom: false,
          isReservableStudyRoom: false,
          isVendingArea: false,
        });

        // If the request was successful, clear any previous error
        setError(null);

        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        // Set the error state with the message from the error object
        setError(error.message);
      });
  };

  return (
    <div>
      <h2>Add Building</h2>
      <hr />
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <Input
          title="Name"
          type="text"
          className="form-control"
          name="name"
          value={building.name}
          onChange={handleChange}
        />
        
        <Input
          title="Address"
          type="text"
          className="form-control"
          name="address"
          value={building.address}
          onChange={handleChange}
        />
        
        <Input
          title="Link"
          type="text"
          className="form-control"
          name="link"
          value={building.link}
          onChange={handleChange}
        />

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="isComputerRoom"
            checked={building.isComputerRoom}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="isComputerRoom">
            Computer Room
          </label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="isReservableStudyRoom"
            checked={building.isReservableStudyRoom}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="isReservableStudyRoom">
            Reservable Study Room
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="isVendingArea"
            checked={building.isVendingArea}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="isVendingArea">
            Vending Area
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          Add Building
        </button>
      </form>
    </div>
  );
};

export default AddBuilding;