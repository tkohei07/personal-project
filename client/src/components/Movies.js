import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Movies = () => {
const [movies, setMovies] = useState([]);

useEffect(() => {
    console.log("REACT_APP_BACKEND:", process.env.REACT_APP_BACKEND); // Added console.log
    const requestOptions = {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
    };

    axios
        // .get("/api/movies", requestOptions)
        .get(`${process.env.REACT_APP_BACKEND}/api/movies`, requestOptions)
        .then((response) => {
            console.log("Response data:", response.data);
            setMovies(response.data);
        })
        .catch((err) => {
            console.error("Error during axios request:", err);
        });
}, []);

  return(
        <div>
            <h2>Movies</h2>
            <hr />
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Movie</th>
                        <th>Release Date</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map((m) => (
                        <tr key={m.id}>
                            <td>
                                <Link to={`/movies/${m.id}`}>
                                    {m.title}
                                </Link>
                            </td>
                            <td>{m.release_date}</td>
                            <td>{m.mpaa_rating}</td>
                        </tr>    
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Movies;