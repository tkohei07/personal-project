const favoritesService = {
  getFavorites: async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/user/${userId}/favorites`);
      const data = await response.json();
      return data || [];
    } catch (err) {
      console.log("Error fetching favorites:", err);
      return [];
    }
  },

  toggleFavorite: async (userId, buildingId, method) => {
    const requestOptions = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        buildingId: buildingId,
      }),
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/user/${userId}/favorites`, requestOptions);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log("Error changing favorite:", err);
    }
  },
};

export default favoritesService;
