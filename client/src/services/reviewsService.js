const reviewsService = {
  addReview: async (buildingId, userId, rating, comment) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        buildingId: buildingId,
        userId: userId,
        rating: rating,
        comment: comment,
      }),
    };

    const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/add-review/${buildingId}`, requestOptions);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
  },

  fetchReviewsByBuildingId: async (buildingId) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/reviews/${buildingId}`);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error);
    }
  },

  fetchReviewsByUserId: async (userId) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/user/${userId}/reviews`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return data || [];
  },

  deleteReview: async (reviewId) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/review/${reviewId}`, requestOptions);
    if (!response.ok) {
      throw new Error('Failed to delete review');
    }
  },
};

export default reviewsService;
