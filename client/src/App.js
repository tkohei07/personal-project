import { Link, Outlet } from 'react-router-dom';
import { LoadScript } from "@react-google-maps/api";

import { useUser } from './contexts/UserContext';

function App() {
  const { loggedIn, setLoggedIn } = useUser();

  const googleMapsApiKey = process.env.REACT_APP_GOOGLEMAPS_API_KEY;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
    <div className="container">
      <div className="row">
        <div className="col">
          <h1 className="mt-3">Let's find the place where you can study</h1>
          <div className="col text-end">
            {loggedIn ? (
              <button onClick={handleLogout}>
                <span className="badge bg-success">Logout</span>
              </button>
            ) : (
              <Link to="/login">
                <span className="badge bg-success">Login</span>
              </Link>
            )}
          </div>
        </div>
        <hr className="mb-3"></hr>
      </div>

      <div className="row">
        <div className="col-md-2">
          <nav>
            <div className="list-group">
              <Link to="/" className="list-group-item list-group-item-action">
                Home
              </Link>
              {loggedIn && (
                <>
                  <Link to="/add-building" className="list-group-item list-group-item-action">
                    Add Building
                  </Link>
                  <Link to="/add-hours" className="list-group-item list-group-item-action">
                    Add Hours
                  </Link>
                  <Link to="/my-favorite-buildings" className="list-group-item list-group-item-action">
                    My Buildings
                  </Link>
                  <Link to="/my-reviews" className="list-group-item list-group-item-action">
                    My Reviews
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
        <div className="col-md-10">
          <Outlet />
        </div>
      </div>
    </div>
    </LoadScript>
  );
}

export default App;