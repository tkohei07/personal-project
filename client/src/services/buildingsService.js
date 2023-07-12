const buildingsService = {
  getAllBuildings: async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/all-buildings`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  fetchBuildingById: async (buildingId) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/building/${buildingId}`);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error);
    }
  },

  fetchBuildingsWithTodayHours: async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKD}/api/buildings`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  addBuilding: async (buildingObject) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildingObject),
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/buildings`, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to add building: ${data.error}`);
      }

      return data;

    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  },

  updateBuilding: async (buildingId, buildingObject) => {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildingObject),
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/building/${buildingId}`, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to update building: ${data.error}`);
      }

      return data;

    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  },

  deleteBuilding: async (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
          "Content-Type": "application/json",
      },
    };
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/buildings/${id}`, requestOptions);
      if (!response.ok) {
        throw new Error("Failed to delete building.");
      }
      return id;
    } catch (err) {
      throw err;
    }
  },

};

export default buildingsService;
