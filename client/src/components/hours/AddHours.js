import { useState, useEffect } from "react";
import { daysOfWeek, timeOptions } from '../../constants/timeAndDate';
import Checkbox from "../form/Checkbox";
import Input from "../form/Input";
import Select from "../form/Select";
import TimeSelect from "../form/TimeSelect";
import { useFetchBuildings} from "../../hooks/buildings/useFetchBuildings";
import hoursService from "../../services/hoursService";

const AddHours = () => {
  const [error, setError] = useState(null);
  const buildings = useFetchBuildings();

  const [hours, setHours] = useState({
    id: 0,
    buildingId: "",
    dayOfWeek: [],
    startDate: "",
    endDate: "",
    openTime: "",
    closeTime: "",
  });

  // When "Building" changes, update "buildingId" in hours state
  const handleBuildingChange = (event) => {
    const { name, value } = event.target;
    setHours({ ...hours, [name]: Number(value) });
  };

  const handleHoursChange = (event) => {
    const { name, value, checked } = event.target;
    if (name === "dayOfWeek") {
      if (checked) {
        setHours({
          ...hours,
          dayOfWeek: [...hours.dayOfWeek, value]
        });
      } else {
        setHours({
          ...hours,
          dayOfWeek: hours.dayOfWeek.filter((day) => day !== value),
        });
      }
    } else {
      setHours({ ...hours, [name]: value });
    }
  };

  const handleHoursSubmit = async (event) => {
    event.preventDefault();

    // Validate all fields are filled
    for (let key in hours) {
      if (hours[key] === '' || (Array.isArray(hours[key]) && hours[key].length === 0)) {
        setError(`Please fill in all fields. "${key}" is missing.`);
        return;
      }
    }

    // Validate dates and times
    if (new Date(hours.startDate) > new Date(hours.endDate)) {
      setError("The start date cannot be later than the end date.");
      return;
    }
    if (hours.openTime > hours.closeTime) {
      setError("The opening time cannot be later than the closing time.");
      return;
    }

    try {
      const hoursList = hours.dayOfWeek.map((dayLabel) => {
        const dayObject = daysOfWeek.find(day => day.label === dayLabel);
        const dayId = dayObject ? dayObject.id : null;
    
        return {
          ...hours,
          buildingId: Number(hours.buildingId),
          dayOfWeek: dayId,
        };
      });
    
      const fetchRequests = hoursList.map((hourObject) => hoursService.addHours(hourObject));
    
      // Wait for all fetch requests to complete
      await Promise.all(fetchRequests);
    
      console.log("Hours added successfully");
      setHours({
        id: 0,
        buildingId: "",
        dayOfWeek: [],
        startDate: "",
        endDate: "",
        openTime: "",
        closeTime: "",
      });
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };
    

  return (
    <div>
      <h2>Add Hours</h2>
      <hr />
      {buildings && buildings.length > 0 ? (
        <form onSubmit={handleHoursSubmit}>
          <Select
            id="buildingId"
            title="Building"
            name="buildingId"
            className="form-control"
            value={hours.buildingId}
            onChange={handleBuildingChange}
            optionDefault="Select a building"
            options={buildings}
          />

          <div className="mb-3">
            <label htmlFor="dayOfWeek" className="form-label">
              Day of the week
            </label>
            <br />
          {daysOfWeek.map((day, index) => (
            <Checkbox
              key={index}
              id={`dayOfWeek-${index}`}
              name="dayOfWeek"
              value={day.label}
              checked={hours.dayOfWeek.includes(day.label)}
              onChange={handleHoursChange}
            />
          ))}
          </div>

          <Input
            id="startDate"
            title="Start Date"
            type="date"
            className="form-control"
            name="startDate"
            value={hours.startDate}
            onChange={handleHoursChange}
          />
          
          <Input
            id="endDate"
            title="End Date"
            type="date"
            className="form-control"
            name="endDate"
            value={hours.endDate}
            onChange={handleHoursChange}
          />

          <TimeSelect
            id="openTime"
            title="Open Time"
            name="openTime"
            className="form-control"
            value={hours.openTime}
            onChange={handleHoursChange}
            optionDefault="Select Open Time"
            options={timeOptions()}
          />

          <TimeSelect
            id="closeTime"
            title="Close Time"
            name="closeTime"
            className="form-control"
            value={hours.closeTime}
            onChange={handleHoursChange}
            optionDefault="Select Close Time"
            options={timeOptions()}
          />

          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>
      ) : (
        <p>No Buildings are registered.</p>
      )}
    </div>
  );
};

export default AddHours;
