import { useState } from "react";
import { useNavigate } from "react-router-dom";
import reviewsService from '../../services/reviewsService';

const useAddReview = (buildingId, userId) => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const addReview = async (rating, comment) => {
    try {
      await reviewsService.addReview(buildingId, userId, rating, comment);
      navigate(`/reviews/${buildingId}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return { addReview, error };
}

export default useAddReview;
