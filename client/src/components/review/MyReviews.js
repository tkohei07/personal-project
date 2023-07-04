import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useUser } from '../../contexts/UserContext';
import { useFetchReviewsByUserId } from '../../hooks/reviews/useFetchReviews';
import useDeleteReview from '../../hooks/reviews/useDeleteReview';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

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
    <Box sx={{ m: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Reviews
      </Typography>
      <hr />
      <List>
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <ListItem key={review.id}>
              <Box>
                <Typography variant="subtitle1">
                  Review for {review.buildingName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                  <Typography variant="subtitle2" sx={{ ml: 1, fontSize: '0.8em' }}>
                    {new Date(review.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {review.comment}
                </Typography>
              </Box>
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleDelete(review.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        ) : (
          <Typography variant="subtitle1">
            You haven't made any reviews yet.
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default MyReviews;
