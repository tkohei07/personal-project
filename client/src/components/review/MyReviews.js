import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useUser } from '../../contexts/UserContext';
import { useFetchReviewsByUserId } from '../../hooks/reviews/useFetchReviews';
import useDeleteReview from '../../hooks/reviews/useDeleteReview';

const MyReviews = () => {
  const { userId } = useUser();
  const reviewsFromFetch = useFetchReviewsByUserId(userId);
  const [reviews, setReviews] = useState([]);
  const { deleteReview } = useDeleteReview();

  useEffect(() => {
    setReviews(reviewsFromFetch);
  }, [reviewsFromFetch]);

  const handleDelete = (reviewId) => {
    deleteReview(reviewId);
    setReviews(reviews.filter(review => review.id !== reviewId));
  };

  return (
    <div>
      <h2>My Reviews</h2>
      <hr />
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id}>
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
          <p>Review for {review.buildingName}</p>
          <p>{review.comment}</p>
          <button onClick={() => handleDelete(review.id)}>Delete</button>
          <br />
          </div>
        ))
      ) : (
        <p>You haven't made any reviews yet.</p>
      )}

    </div>
  )
}

export default MyReviews;
