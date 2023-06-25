import { useState, useEffect } from 'react';
import reviewsService from '../../services/reviewsService';

const useFetchReviewsByBuildingId = (buildingId) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewsData = await reviewsService.fetchReviewsByBuildingId(buildingId);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    fetchData();
  }, [buildingId]);

  return reviews;
};

const useFetchReviewsByUserId = (userId) => {
  const [reviews, setReviews] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const myReviews = await reviewsService.fetchReviewsByUserId(userId);
        setReviews(myReviews);
      } catch (error) {
        console.error('Failed to fetch user reviews:', error);
      }
    };

    fetchData();
  }, [userId]);

  return reviews;
};

  
export { useFetchReviewsByBuildingId, useFetchReviewsByUserId };