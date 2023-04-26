import { useState } from "react";
import axios from "axios";

const AddMovie = () => {
  const [movie, setMovie] = useState({
    id: 0,
    title: "",
    release_date: "",
    runtime: "",
    mpaa_rating: "",
    description: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMovie({ ...movie, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    // We need to convert the values in JSON for release date (to date)
    // and for runtime to int
    const requestBody = {
      ...movie,
      release_date: new Date(movie.release_date),
      runtime: parseInt(movie.runtime, 10),
    };

    requestBody.release_date = new Date(movie.release_date);
    requestBody.runtime = parseInt(movie.runtime, 10);

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody)
    }

    fetch(`${process.env.REACT_APP_BACKEND}/movies`, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add movie');
        }
        console.log('Movie added successfully');
        setMovie({
          id: 0,
          title: "",
          release_date: "",
          runtime: "",
          mpaa_rating: "",
          description: "",
        });
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h2>Add Movie</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={movie.title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="release_date" className="form-label">
            Release Date
          </label>
          <input
            type="date"
            className="form-control"
            id="release_date"
            name="release_date"
            value={movie.release_date}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="runtime" className="form-label">
            Runtime (minutes)
          </label>
          <input
            type="number"
            className="form-control"
            id="runtime"
            name="runtime"
            value={movie.runtime}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="mpaa_rating" className="form-label">
            MPAA Rating
          </label>
          <select
            className="form-select"
            id="mpaa_rating"
            name="mpaa_rating"
            value={movie.mpaa_rating}
            onChange={handleChange}
          >
            <option value=""></option>
            <option value="G">G</option>
            <option value="PG">PG</option>
            <option value="PG-13">PG-13</option>
            <option value="R">R</option>
            <option value="NC-17">NC-17</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={movie.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Movie
        </button>
      </form>
    </div>
  );
};

export default AddMovie;
