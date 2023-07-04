import React from 'react';
import { useParams, Link as RouterLink } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useFetchBuildingById } from '../../hooks/buildings/useFetchBuildings';
import { useFetchReviewsByBuildingId } from '../../hooks/reviews/useFetchReviews';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const Reviews = () => {
  const { id } = useParams();
  const { building } = useFetchBuildingById(id);
  const reviews = useFetchReviewsByBuildingId(id);

  return (
    <Box sx={{ m: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reviews for {building.name}
      </Typography>
      <hr />
      <List>
        {!reviews ? (
          <Typography variant="subtitle1">
            No reviews yet. Be the first to review this building!
          </Typography>
        ) : (
          reviews.map(review => (
            <ListItem key={review.id}>
              <ListItemText
                primary={
                  <Typography variant="h5">
                    {review.username}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Box display="flex" alignItems="center">
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
                      <Typography variant="subtitle1" sx={{ ml: 2, fontSize: "0.8em" }}>
                        {new Date(review.updatedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {review.comment}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))
        )}
      </List>
      <Button component={RouterLink} to={`/add-review/${id}`} variant="contained" sx={{ mt: 3 }}>
        Add Review
      </Button>
    </Box>
  );
};

export default Reviews;
