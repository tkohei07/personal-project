import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import Rating from "react-rating";
import { FaAngleDown, FaAngleUp, FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import axios from 'axios';
import { useUser } from './../UserContext';

// timeObj : HH:MM:SS
function formatTime(timeObj) {
  // Check if the input is an object with a valid time string
  if (typeof timeObj === 'object' && timeObj.Valid) {
    const timeStr = timeObj.String;

    // Split the time string into hours and minutes
    const [hours, minutes] = timeStr.split(":");
    const hoursInt = parseInt(hours, 10);
    const amPm = hoursInt >= 12 ? "pm" : "am";
    const formattedHours = hoursInt % 12 || 12;
    return `${formattedHours}:${minutes} ${amPm}`;
  } else {
    return "Closed";
  }
}

const Home = () => {
  const [buildings, setBuildings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [shownBuildingId, setShownBuildingId] = useState(null);
  const { userId } = useUser();
  const [isOpenToday, setIsOpenToday] = useState(false);
  // for fectching lat and lng
  const [coordinates, setCoordinates] = useState({});
  const { loggedIn } = useUser();

  const [search, setSearch] = useState("");

  // Fetch buildings
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(`${process.env.REACT_APP_BACKEND}/api/buildings`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setBuildings(data);
      })
      .catch(err => {
        console.log("error:", err);
      })

  }, []);

  // Fetch favorites
  useEffect(() => {
    if (userId) {
      const requestOptions = {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      };

      fetch(`${process.env.REACT_APP_BACKEND}/api/user/${userId}/favorites`, requestOptions)
          .then((response) => response.json())
          .then((data) => {
              setFavorites(data || []);
          })
          .catch(err => {
              console.log("err:", err);
          });
    }

  }, [userId]);

  // Favorite a building
  const handleFavorite = (buildingId) => {
    if (loggedIn) {
      const favoritesIds = favorites ? favorites.map(favorite => favorite.buildingId) : [];
      const requestOptions = {
          method: favoritesIds.includes(buildingId) ? "DELETE" : "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              userId: userId,
              buildingId: buildingId,
          }),
      };

      fetch(`${process.env.REACT_APP_BACKEND}/api/user/${userId}/favorites`, requestOptions)
          .then((response) => response.json())
          .then((data) => {
              // Update the local state based on the response
              if (data.error) {
                  console.log("Error changing favorite:", data.error);
              } else {
                  if (favoritesIds.includes(buildingId)) {
                      setFavorites(favorites.filter(favorite => favorite.buildingId !== buildingId));
                  } else {
                      setFavorites([...favorites, { userId: userId, buildingId: buildingId }]);
                  }
              }
          })
          .catch((err) => {
              console.log("Error changing favorite:", err);
          });
    }
  };

  const deleteBuilding = (id) => {
    if (!window.confirm("Are you sure you want to delete this building? This will also delete all related information.")) {
        return;
    }
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    };
    
    fetch(`${process.env.REACT_APP_BACKEND}/api/buildings/${id}`, requestOptions)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to delete building.");
        }
        setBuildings(buildings.filter((building) => building.id !== id));
    })
    .catch((err) => {
        console.log("Error deleting building:", err);
    });
  };

  const filteredBuildings = buildings 
    ? buildings
      .filter((building) =>
        building.name.toLowerCase().includes(search.toLowerCase())
      )
      .filter((building) =>
        !isOpenToday || formatTime(building.open_time) !== "Closed"
      )
    : [];

  const googleMapsApiKey = process.env.REACT_APP_GOOGLEMAPS_API_KEY;

  // Fetch coordinates
  useEffect(() => {
    const getCoordinates = async (address) => {
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMapsApiKey}`);
        const { data } = response;
        if (data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          return location;
        }
      } catch (error) {
        console.error('Failed to fetch coordinates: ', error);
      }
      return null;
    };
  
    const fetchCoordinates = async () => {
      const coords = {};
      for (const building of buildings) {
        const location = await getCoordinates(building.address);
        if (location) {
          coords[building.id] = location;
        }
      }
      setCoordinates(coords);
    };
  
    fetchCoordinates();
  }, [buildings, googleMapsApiKey]);

  const mapStyles = {
    height: "50vh",
    width: "100%"
  };

  const defaultCenter = {
    lat: 45.0774041, lng: -94.43032939999999
  }

  return (
    <div>
      <h2>Buildings opened today</h2>
      <hr />
      <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value={isOpenToday}
            onChange={(e) => setIsOpenToday(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="isOpenToday">
            Open today
          </label>
      </div>
      <input
        type="text"
        placeholder="Search building by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="form-control mb-3"
      />
      
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Building</th>
            <th>Today</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
        {filteredBuildings && filteredBuildings.length > 0 ? (
          filteredBuildings.map((m) => (
              <tr key={m.id}>
                <td>
                  <Link to={`/buildings/${m.id}`}>
                    {m.name}
                  </Link>
                </td>
                <td>
                  {
                    formatTime(m.open_time) === "Closed" 
                    ? "Closed"
                    : `${formatTime(m.open_time)} - ${formatTime(m.close_time)}`
                  }
                  <Link to={`/hours/${m.id}`}>
                    <button className="btn btn-sm btn-primary ml-2">
                      more
                    </button>
                  </Link>
                </td>

                <td>
                  <Rating
                    initialRating={m.ave_rating}
                    emptySymbol={<FaStar color="gray" />}
                    fullSymbol={<FaStar color="gold" />}
                    readonly
                  />
                  <Link to={`/reviews/${m.id}`}>
                    <button className="btn btn-sm btn-primary ml-2">
                      more
                    </button>
                  </Link>
                </td>
                <td>
                  {loggedIn && (
                    <button onClick={() => handleFavorite(m.id)} className="btn">
                      {favorites && favorites.some(favorite => favorite.buildingId === m.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                  )}
                </td>
                <td>
                  <button onClick={() => setShownBuildingId(shownBuildingId === m.id ? null : m.id)}>
                    {shownBuildingId === m.id ? <FaAngleUp /> : <FaAngleDown />}
                  </button>
                </td>
                    
                {shownBuildingId === m.id && (
                    <td colSpan="3">
                    <LoadScript googleMapsApiKey={googleMapsApiKey}>
                      <GoogleMap
                        mapContainerStyle={mapStyles}
                        zoom={13}
                        center={coordinates[m.id] || defaultCenter}
                      >
                          {coordinates[m.id] &&
                              <MarkerF key={m.id} position={coordinates[m.id]} />
                          }
                      </GoogleMap>
                    </LoadScript>
                      <h3>info for {m.name}</h3>
                      <h4>Services:</h4>
                      <ul>
                        {m.isComputerRoom && <li>Computer Room</li>}
                        {m.isReservableStudyRoom && <li>Reservable Study Room</li>}
                        {m.isVendingArea && <li>Vending Area</li>}
                      </ul>
                      
                      {loggedIn && (
                        <td>
                          <Link to={`/buildings/edit/${m.id}`} className="btn btn-primary">
                              Edit
                          </Link>
                          <button onClick={() => deleteBuilding(m.id)} className="btn btn-danger">
                              Delete
                          </button>
                        </td>
                      )}
                      </td>
                    
                )}
            </tr>
              
          ))
        ) : (
          <tr>
            <td colSpan="2">No buildings open today</td>
          </tr>
        )}

        </tbody>

      </table>
    </div>
  )
}

export default Home;
