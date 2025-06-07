import React, { createContext, useState } from "react";

export const UserDataContext = createContext(); // ✅ Export the context itself

const UserContext = ({ children }) => {
  const [user, setUser] = useState({
    email: '',
    fullName: {
      firstName: '',
      lastName: ''
    }
  });

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext; // Provider component
