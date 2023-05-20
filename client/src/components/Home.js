import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";

function formatTime(timeStr) {
  const [hours, minutes] = timeStr.split(":");
  const hoursInt = parseInt(hours, 10);
  const amPm = hoursInt >= 12 ? "pm" : "am";
  const formattedHours = hoursInt % 12 || 12;
  return `${formattedHours}:${minutes} ${amPm}`;
}

const Home = () => {
  const [buildings, setBuildings] = useState([]);
  const [search, setSearch] = useState("");

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

  const filteredBuildings = buildings 
    ? buildings.filter((building) =>
        building.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div>
      <h2>Buildings opened today</h2>
      <hr />
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
                <td>{formatTime(m.open_time)} - {formatTime(m.close_time)}</td>
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
