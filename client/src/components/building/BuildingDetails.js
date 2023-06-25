import { Link } from 'react-router-dom';
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { mapStyles, serviceStyles, defaultCenter } from '../../constants/styles.js';

const BuildingDetails = ({ building, coordinates, onDelete, loggedIn }) => {
  const coordinatesExist = coordinates[building.id];

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={mapStyles}>
        {!coordinatesExist && <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          backgroundColor: "#fff",
          padding: "10px"
        }}>The address of this building is not registered or wrong</div>}
        <GoogleMap
            mapContainerStyle={{width: '100%', height: '100%'}}
            zoom={13}
            center={coordinatesExist || defaultCenter}
        >
          {coordinatesExist && 
          <MarkerF key={building.id} position={coordinates[building.id]} />}
        </GoogleMap>
      </div>

      <div style={serviceStyles}>
        <div>
          <h4>Services:</h4>
          <ul>
            {building.isComputerRoom && <li>Computer Room</li>}
            {building.isReservableStudyRoom && <li>Reservable Study Room</li>}
            {building.isVendingArea && <li>Vending Area</li>}
          </ul>
        </div>
    
        {loggedIn && (
          <div style={{ alignSelf: 'flex-end' }}>
            <Link to={`/buildings/edit/${building.id}`} className="btn btn-primary">
              Edit
            </Link>
            <button onClick={() => onDelete(building.id)} className="btn btn-sm btn-danger ml-2">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuildingDetails;
