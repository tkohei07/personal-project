import { useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from '../../contexts/UserContext';
import StarRating from "../form/StarRating";
import { useFetchBuildingById } from '../../hooks/buildings/useFetchBuildings';
import useAddReview from '../../hooks/reviews/useAddReview';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

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
    <Box sx={{ m: 3 }}>
      <Typography variant="h4" gutterBottom>
        Review {building.name}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <StarRating
            value={rating}
            onChange={handleRatingChange}
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <TextField
            id="comment"
            label="Comment"
            multiline
            rows={4}
            value={comment}
            onChange={handleCommentChange}
            fullWidth
          />
        </Box>
        {error && <Alert severity="error">{error} - UserId: {userId}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Button type="submit" variant="contained">
          Submit Review
        </Button>
      </Box>
    </Box>
  );
};

export default AddReview;