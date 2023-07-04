import { Link, Outlet } from 'react-router-dom';
import { LoadScript } from "@react-google-maps/api";
import { useUser } from './contexts/UserContext';
import './styles/App.css';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/system/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { VpnKey as VpnKeyIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';

function App() {
  const { loggedIn, setLoggedIn } = useUser();

  const googleMapsApiKey = process.env.REACT_APP_GOOGLEMAPS_API_KEY;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <Box sx={{ m: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tabs>
            <Tab label="Home" component={Link} to="/" />
            {loggedIn && (
              <>
                <Tab label="Add Building" component={Link} to="/add-building" />
                <Tab label="Add Hours" component={Link} to="/add-hours" />
                <Tab label="My Buildings" component={Link} to="/my-favorite-buildings" />
                <Tab label="My Reviews" component={Link} to="/my-reviews" />
              </>
            )}
          </Tabs>

          {loggedIn ? (
            <IconButton onClick={handleLogout} color="primary">
              <ExitToAppIcon />
            </IconButton>
          ) : (
            <Link to="/login">
              <IconButton color="primary">
                <VpnKeyIcon />
              </IconButton>
            </Link>
          )}
        </Box>
        <div className="custom-container">
          <Outlet />
        </div>

      </Box>
    </LoadScript>
  );
}

export default App;
