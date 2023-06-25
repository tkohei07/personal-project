import React from 'react';
import { useParams, Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useFetchBuildingById } from '../../hooks/buildings/useFetchBuildings';
import { useFetchReviewsByBuildingId } from '../../hooks/reviews/useFetchReviews';

const Reviews = () => {
  const { id } = useParams();
  const { building } = useFetchBuildingById(id);
  const reviews = useFetchReviewsByBuildingId(id);

  return (
    <div>
      <h2>Reviews for {building.name}</h2>
      {!reviews ? (
        <p>No reviews yet. Be the first to review this building!</p>
      ) : (
        reviews.map(review => (
          <div key={review.id}>
            <h3>{review.username}</h3>
            <div>
              {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;
                return (
                  <label key={i}>
                    <FaStar
                      size={15}
                      color={ratingValue <= review.rating ? "#ffc107" : "#e4e5e9"}
                    />
                  </label>
                );
              })}
              <span style={{ marginLeft: "15px", fontSize: "0.8em" }}>{new Date(review.updatedAt).toLocaleDateString()}</span>
            </div>
            <p>{review.comment}</p>
            <br />
          </div>
        ))
      )}
      <Link to={`/add-review/${id}`}>Add Review</Link>
    </div>
  );
};

export default Reviews;
