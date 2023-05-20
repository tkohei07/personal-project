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
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBuilding({ ...building, [name]: value });
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
      body: JSON.stringify(buildingObject)
    }

    fetch(`${process.env.REACT_APP_BACKEND}/api/buildings`, requestOptions)
      .then(async response => {
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
          link: ""
        });

        // If the request was successful, clear any previous error
        setError(null);

        // Navigate to the /buildings route
        navigate("/buildings");
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
        <button type="submit" className="btn btn-primary">
          Add Building
        </button>
      </form>
    </div>
  );
};

export default AddBuilding;
