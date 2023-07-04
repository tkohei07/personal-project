import { useState } from "react";
import { daysOfWeek } from '../../constants/timeAndDate';
import { useFetchBuildings } from "../../hooks/buildings/useFetchBuildings";
import hoursService from "../../services/hoursService";
import Box from '@mui/system/Box';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

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
    <Box sx={{ m: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add Hours
      </Typography>
      <hr />
      {buildings && buildings.length > 0 ? (
        <form onSubmit={handleHoursSubmit}>
          <InputLabel id="building-label">Building</InputLabel>
          <Select
            labelId="building-label"
            id="buildingId"
            name="buildingId"
            value={hours.buildingId}
            onChange={handleBuildingChange}
            fullWidth
            margin="dense"
          >
            {buildings.map((building, index) => (
              <MenuItem key={index} value={building.id}>{building.name}</MenuItem>
            ))}
          </Select>

          {daysOfWeek.map((day, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  id={`dayOfWeek-${index}`}
                  name="dayOfWeek"
                  label="Day of Week"
                  value={day.label}
                  checked={hours.dayOfWeek.includes(day.label)}
                  onChange={handleHoursChange}
                />
              }
              label={day.label}
            />
          ))}

          <TextField
            id="startDate"
            label="Start Date"
            type="date"
            name="startDate"
            value={hours.startDate}
            onChange={handleHoursChange}
            required
            fullWidth
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              "data-testid": "start-date-input",
            }}
          />
          
          <TextField
            id="endDate"
            label="End Date"
            type="date"
            name="endDate"
            value={hours.endDate}
            onChange={handleHoursChange}
            required
            fullWidth
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              "data-testid": "end-date-input",
            }}
          />

          <TextField
            id="openTime"
            label="Open Time"
            type="time"
            name="openTime"
            value={hours.openTime}
            onChange={handleHoursChange}
            required
            fullWidth
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300,
              "data-testid": "open-time-input",
            }}
          />

          <TextField
            id="closeTime"
            label="Close Time"
            type="time"
            name="closeTime"
            value={hours.closeTime}
            onChange={handleHoursChange}
            required
            fullWidth
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300,
              "data-testid": "close-time-input",
            }}
          />

          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </form>
      ) : (
        <Typography variant="subtitle1" gutterBottom>
          No Buildings are registered.
        </Typography>
      )}
    </Box>
   );
};

export default AddHours;
