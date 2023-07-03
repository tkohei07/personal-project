import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from '../../contexts/UserContext';
import { daysOfWeek } from '../../constants/timeAndDate';
import { useFetchBuildingById } from '../../hooks/buildings/useFetchBuildings';
import { useFetchHours } from '../../hooks/hours/useFetchHours';
import useDeleteHour from '../../hooks/hours/useDeleteHour';
import Box from '@mui/system/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

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
    <Box sx={{ m: 3 }}>
      <Typography variant="h4" gutterBottom>
        Hours: {building.name}
      </Typography>
      <hr />
      {hours && hours.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                {loggedIn && <TableCell></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {hours.map((hour) => {
                // convert date strings to Date objects
                const startDate = new Date(hour.startDate);
                const endDate = new Date(hour.endDate);

                // Convert time strings to Date objects
                const openTime = new Date(`1970-01-01T${hour.openTimeStr}`);
                const closeTime = new Date(`1970-01-01T${hour.closeTimeStr}`);

                // Convert time to 12-hour format
                const openTimeStr = openTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                const closeTimeStr = closeTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

                return (
                  <TableRow key={hour.id}>
                    <TableCell>{startDate.toLocaleDateString()}-{endDate.toLocaleDateString()}</TableCell>
                    <TableCell>{daysOfWeek.find(day => day.id === hour.dayOfWeek)?.label}</TableCell>
                    <TableCell>{openTimeStr}-{closeTimeStr}</TableCell>
                    {loggedIn && (
                      <TableCell>
                        <Button variant="contained" color="error" onClick={() => deleteHour(hour.id, hours, setHours)}>
                          Delete
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="subtitle1" gutterBottom>
          No hours for this building.
        </Typography>
      )}
    </Box>
  );
}

export default Hours;
