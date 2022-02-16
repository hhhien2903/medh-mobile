import React, { useState } from 'react';
import { firebaseApp } from '../config/firebase';
export const AppContext = React.createContext();

export default function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkIfLoggedIn = () => {
      firebaseApp.auth().onAuthStateChanged((firebaseUser) => {
        if (user) {
          setCurrentUser(firebaseUser);
        } else {
          setCurrentUser(null);
        }
      });
    };

    return () => {
      checkIfLoggedIn();
    };
  }, []);

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser, isLoading }}>
      {children}
    </AppContext.Provider>
  );
}
