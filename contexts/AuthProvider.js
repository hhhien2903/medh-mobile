import React, { useEffect, useState } from 'react';
export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>{children}</AuthContext.Provider>
  );
}
