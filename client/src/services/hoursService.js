const hoursService = {
  fetchHours: async (id) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/hours/${id}`);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error);
    }
  },

  addHours: async (hoursObject) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hoursObject),
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/add-hours`, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to add hours: ${data.error}`);
      }

      return data;
    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  },

  deleteHour: async (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: { 
          "Content-Type": "application/json"
      },
    };

    const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/hours/${id}`, requestOptions);
    
    if (!response.ok) {
      throw new Error("Failed to delete hour.");
    }
  },

};

export default hoursService;
