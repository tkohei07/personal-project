const authService = {
  login: async (userObject) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userObject),
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/authenticate`, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        const error = `Failed to login: ${data.message}`;
        return { error };
      }

      if (data.token) {
        return { token: data.token, id: data.id };
      } else {
        const error = `Failed to login: ${data.message}`;
        return { error };
      }
    } catch (error) {
      return { error: error.toString() };
    }
  },

  register: async (userObject) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userObject),
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/register`, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        let error = `Failed to register: ${data.error}`;
        if (data.message.includes('duplicate key value violates unique constraint "users_username_key"')) {
          error = 'Username already exists. Please choose a different username.';
        }
        return { error };
      }

      console.log("Registration successful");
      return data;
    } catch (error) {
      console.error('Error:', error);
      return { error: error.toString() };
    }
  },
};

export default authService;
