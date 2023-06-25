import { useNavigate } from "react-router-dom";
import Input from "../form/Input";
import CheckBox from "../form/Checkbox";
import useAddBuilding from '../../hooks/buildings/useAddBuilding';

const AddBuilding = () => {
  const navigate = useNavigate();
  const { building, handleChange, handleCheckboxChange, handleSubmit, error, isBuildingAdded } = useAddBuilding();

  // After successful building addition, use navigation to redirect to home
  if (isBuildingAdded) {
    navigate("/");
  }

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

        <CheckBox
          id="isComputerRoom"
          value="Computer Room"
          name="isComputerRoom"
          checked={building.isComputerRoom}
          onChange={handleCheckboxChange}
        />

        <CheckBox
          id="isReservableStudyRoom"
          value="Reservable Study Room"
          name="isReservableStudyRoom"
          checked={building.isReservableStudyRoom}
          onChange={handleCheckboxChange}
        />

        <CheckBox
          id="isVendingArea"
          value="Vending Area"
          name="isVendingArea"
          checked={building.isVendingArea}
          onChange={handleCheckboxChange}
        />
        <br />
        <button type="submit" className="btn btn-primary">
          Add Building
        </button>
      </form>
    </div>
  );
};

export default AddBuilding;
