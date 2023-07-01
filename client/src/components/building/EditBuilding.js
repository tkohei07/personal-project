//EditBuilding.test.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../form/Input";
import CheckBox from "../form/Checkbox";
import { useFetchBuildingById } from "../../hooks/buildings/useFetchBuildings";
import useUpdateBuilding from "../../hooks/buildings/useUpdateBuilding";

const EditBuilding = () => {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const { building, setBuilding } = useFetchBuildingById(id);
  const { updateBuilding } = useUpdateBuilding();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [link, setLink] = useState("");
  const [isComputerRoom, setIsComputerRoom] = useState(false);
  const [isReservableStudyRoom, setIsReservableStudyRoom] = useState(false);
  const [isVendingArea, setIsVendingArea] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (building) {
      setName(building.name);
      setAddress(building.address);
      setLink(building.link);
      setIsComputerRoom(building.isComputerRoom);
      setIsReservableStudyRoom(building.isReservableStudyRoom);
      setIsVendingArea(building.isVendingArea);
    }
  }, [building]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleLinkChange = (event) => {
    setLink(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    switch (name) {
      case "isComputerRoom":
        setIsComputerRoom(checked);
        break;
      case "isReservableStudyRoom":
        setIsReservableStudyRoom(checked);
        break;
      case "isVendingArea":
        setIsVendingArea(checked);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const buildingData = {
      name: name,
      address: address,
      link: link,
      isComputerRoom: isComputerRoom,
      isReservableStudyRoom: isReservableStudyRoom,
      isVendingArea: isVendingArea,
    };

    try {
      const data = await updateBuilding(id, buildingData);
      navigate(`/`);
    } catch (err) {
      console.log("error:", err);
    }
  };

  return (
    <div className="container">
      <h1>Edit Building</h1>
      <hr />
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <Input
          id="name"
          title="Name"
          type="text"
          className="form-control"
          name="name"
          value={name}
          onChange={handleNameChange}
          required={true}
        />

        <Input
          id="address"
          title="Address"
          type="text"
          className="form-control"
          name="address"
          value={address}
          onChange={handleAddressChange}
        />

        <Input
          id="link"
          title="Link"
          type="text"
          className="form-control"
          name="link"
          value={link}
          onChange={handleLinkChange}
        />

        <CheckBox
          id="isComputerRoom"
          value="Computer Room"
          name="isComputerRoom"
          checked={isComputerRoom}
          onChange={handleCheckboxChange}
        />

        <CheckBox
          id="isReservableStudyRoom"
          value="Reservable Study Room"
          name="isReservableStudyRoom"
          checked={isReservableStudyRoom}
          onChange={handleCheckboxChange}
        />

        <CheckBox
          id="isVendingArea"
          value="Vending Area"
          name="isVendingArea"
          checked={isVendingArea}
          onChange={handleCheckboxChange}
        />

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditBuilding;
