import { useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from '../../contexts/UserContext';
import StarRating from "../form/StarRating";
import { useFetchBuildingById } from '../../hooks/buildings/useFetchBuildings';
import useAddReview from '../../hooks/reviews/useAddReview';

const AddReview = () => {
  const { id } = useParams();
  const { building } = useFetchBuildingById(id);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { userId } = useUser();
  const { addReview, error } = useAddReview(id, userId);
  console.log("userId: ", userId);

  const handleRatingChange = (starValue) => {
    setRating(starValue);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (rating === 0) {
      setErrorMessage("Please provide a rating.");
      return;
    }

    addReview(rating, comment);
  };

  return (
    <div className="container">
      <h1>Review {building.name}</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <StarRating
            value={rating}
            onChange={handleRatingChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="comment" className="form-label">
            Comment:
          </label>
          <textarea
            id="comment"
            className="form-control"
            value={comment}
            onChange={handleCommentChange}
          />
        </div>

        {error && <div className="alert alert-danger">{error} - UserId: {userId}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <button type="submit" className="btn btn-primary">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default AddReview;
