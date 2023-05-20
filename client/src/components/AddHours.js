import { useState, useEffect } from "react";
import Checkbox from "./form/Checkbox";
import Input from "./form/Input";
import Select from "./form/Select";
import TimeSelect from "./form/TimeSelect";

const daysOfWeek = [
  { id: 0, label: "SUN" },
  { id: 1, label: "MON" },
  { id: 2, label: "TUE" },
  { id: 3, label: "WED" },
  { id: 4, label: "THU" },
  { id: 5, label: "FRI" },
  { id: 6, label: "SAT" },
];

const AddHours = () => {
  const [error, setError] = useState(null);
  const [buildings, setBuildings] = useState([]);

  // Get all buildings from the database
  useEffect(() => {
    const requestOptions = {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
    };

    fetch(`${process.env.REACT_APP_BACKEND}/api/all-buildings`)
      .then((response) => response.json())
      .then((data) => {
        setBuildings(data);
      })
      .catch((err) => {
        console.log("error:", err);
      });
  }, []);

  // Create a list of time options for the dropdown
  const timeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hour = i < 10 ? `0${i}` : i;
        const minute = j < 10 ? `0${j}` : j;
        options.push(`${hour}:${minute}`);
      }
    }
    return options;
  };

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

    // validate dates and times
    if (new Date(hours.startDate) > new Date(hours.endDate)) {
      setError("The start date cannot be later than the end date.");
      return;
    }
    if (hours.openTime > hours.closeTime) {
      setError("The opening time cannot be later than the closing time.");
      return;
    }

    // Create a list of hours objects since "dayOfWeek" is an array
    const hoursList = hours.dayOfWeek.map((dayLabel) => {
      // Find the corresponding day object
      const dayObject = daysOfWeek.find(day => day.label === dayLabel);

      // If the day object is found, use its id, otherwise use null
      const dayId = dayObject ? dayObject.id : null;

      return {
        ...hours,
        buildingId: Number(hours.buildingId),
        dayOfWeek: dayId,
      };
    });

    try {
      // Create an array of fetch requests for each object in the hoursList
      const fetchRequests = hoursList.map((hourObject) => {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(hourObject),
        };
        return fetch(`${process.env.REACT_APP_BACKEND}/api/add-hours`, requestOptions);
      });

      // Wait for all fetch requests to complete
      const responses = await Promise.all(fetchRequests);

      // Check for any failed requests
      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error);
          return;
        }
      }

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
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Add Hours</h2>
      <hr />
      <form onSubmit={handleHoursSubmit}>

        <Select
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
          title="Start Date"
          type="date"
          className="form-control"
          id="startDate"
          name="startDate"
          value={hours.startDate}
          onChange={handleHoursChange}
        />
        
        <Input
          title="End Date"
          type="date"
          className="form-control"
          id="endDate"
          name="endDate"
          value={hours.endDate}
          onChange={handleHoursChange}
        />

        <TimeSelect
          title="Open Time"
          name="openTime"
          className="form-control"
          value={hours.openTime}
          onChange={handleHoursChange}
          optionDefault="Select Open Time"
          options={timeOptions()}
        />

        <TimeSelect
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
          Add Hours
        </button>
      </form>
    </div>
    );
};
  
  export default AddHours;
