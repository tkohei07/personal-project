import { Link } from 'react-router-dom';
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { mapStyles, serviceStyles, defaultCenter } from '../../constants/styles.js';
import Box from '@mui/system/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BuildingDetails = ({ building, coordinates, onDelete, loggedIn }) => {
  const coordinatesExist = coordinates[building.id];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', m: 3 }}>
      <Box sx={{ ...mapStyles, position: 'relative' }}>
        {!coordinatesExist && 
          <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            backgroundColor: "#fff",
            p: 1
          }}>
            The address of this building is not registered or wrong
          </Box>
        }
        <GoogleMap
          mapContainerStyle={{width: '100%', height: '100%'}}
          zoom={13}
          center={coordinatesExist || defaultCenter}
        >
          {coordinatesExist && <MarkerF key={building.id} position={coordinates[building.id]} />}
        </GoogleMap>
      </Box>

      <Box sx={{ ...serviceStyles }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Services:
          </Typography>
          <ul>
            {building.isComputerRoom && <li>Computer Room</li>}
            {building.isReservableStudyRoom && <li>Reservable Study Room</li>}
            {building.isVendingArea && <li>Vending Area</li>}
          </ul>
        </Box>
    
        {loggedIn && (
          <Box sx={{ alignSelf: 'flex-end' }}>
            <Link to={`/buildings/edit/${building.id}`}>
              <IconButton aria-label="edit">
                <EditIcon />
              </IconButton>
            </Link>
            <IconButton aria-label="delete" color="error" onClick={() => onDelete(building.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default BuildingDetails;
