import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from '../../contexts/UserContext';
import { daysOfWeek } from '../../constants/timeAndDate';
import { useFetchBuildingById } from '../../hooks/buildings/useFetchBuildings';
import { useFetchHours } from '../../hooks/hours/useFetchHours';
import useDeleteHour from '../../hooks/hours/useDeleteHour';

const Hours = () => {
  const { id } = useParams();
  const { building } = useFetchBuildingById(id);
  const { hours: hoursFromFetch, error } = useFetchHours(id);
  const { deleteHour, error: deleteError } = useDeleteHour();
  const { loggedIn } = useUser();

  const [hours, setHours] = useState([]);

  useEffect(() => {
    setHours(hoursFromFetch);
  }, [hoursFromFetch]);

  return (
    <div>
      <h2>Hours: {building.name}</h2>
      <hr />
      {hours && hours.length > 0 ? (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => {
              // convert date strings to Date objects
              const startDate = new Date(hour.startDate);
              const endDate = new Date(hour.endDate);

              // Convert time strings to Date objects
              const openTime = new Date(`1970-01-01T${hour.openTimeStr}Z`);
              const closeTime = new Date(`1970-01-01T${hour.closeTimeStr}Z`);

              // Convert time to 12-hour format
              const openTimeStr = openTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
              const closeTimeStr = closeTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

              return (
                <tr key={hour.id}>
                  <td>{startDate.toLocaleDateString()}-{endDate.toLocaleDateString()}</td>
                  <td>{daysOfWeek.find(day => day.id === hour.dayOfWeek)?.label}</td>
                  <td>{openTimeStr}-{closeTimeStr}</td>
                  <td>
                    {loggedIn && (
                      <button onClick={() => deleteHour(hour.id, hours, setHours)} className="btn btn-danger">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No hours for this building.</p>
      )}
    </div>
  );
}

export default Hours;
