import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('token') != null);
  const [userId, setUserId] = useState(null); 

  return (
    <UserContext.Provider value={{ loggedIn, setLoggedIn, userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
