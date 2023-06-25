const coordinatesService = {
  fetchCoordinates: async (address, googleMapsApiKey) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMapsApiKey}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return location;
      }
    } catch (error) {
      console.error('Failed to fetch coordinates: ', error);
    }
    return null;
  },
};

export default coordinatesService;
