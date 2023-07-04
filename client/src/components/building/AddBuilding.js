import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAddBuilding from '../../hooks/buildings/useAddBuilding';
import Box from '@mui/system/Box';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

const AddBuilding = () => {
  const { building, handleChange, handleCheckboxChange, handleSubmit, error, isBuildingAdded } = useAddBuilding();
  
  const navigate = useNavigate();
  useEffect(() => {
    if (isBuildingAdded) {
      navigate("/");
    }
  }, [isBuildingAdded]);

  return (
    <Box sx={{ m: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add Building
      </Typography>
      <hr />
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          id="name"
          label="Name"
          type="text"
          name="name"
          variant="outlined"
          value={building.name}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        
        <TextField
          id="address"
          label="Address"
          type="text"
          variant="outlined"
          name="address"
          value={building.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        
        <TextField
          id="link"
          label="Link"
          type="text"
          variant="outlined"
          name="link"
          value={building.link}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <FormControlLabel
          control={
            <Checkbox
              id="isComputerRoom"
              name="isComputerRoom"
              checked={building.isComputerRoom}
              onChange={handleCheckboxChange}
            />
          }
          label="Computer Room"
        />

        <FormControlLabel
          control={
            <Checkbox
              id="isReservableStudyRoom"
              name="isReservableStudyRoom"
              checked={building.isReservableStudyRoom}
              onChange={handleCheckboxChange}
            />
          }
          label="Reservable Study Room"
        />

        <FormControlLabel
          control={
            <Checkbox
              id="isVendingArea"
              name="isVendingArea"
              checked={building.isVendingArea}
              onChange={handleCheckboxChange}
            />
          }
          label="Vending Area"
        />
        <br />
        <Button type="submit" variant="contained" color="primary">
          Add
        </Button>
      </form>
    </Box>
  );
};

export default AddBuilding;
