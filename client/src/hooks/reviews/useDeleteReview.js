import { useState } from 'react';
import reviewsService from '../../services/reviewsService';

const useDeleteReview = () => {
  const [error, setError] = useState(null);

  const deleteReview = async (reviewId) => {
    try {
      await reviewsService.deleteReview(reviewId);
    } catch (error) {
      console.error('Failed to delete review:', error);
      setError(error);
    }
  };

  return { deleteReview, error };
};

export default useDeleteReview;
