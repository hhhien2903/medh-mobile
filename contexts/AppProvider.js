import React, { useState } from 'react';

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
  return <AppContext.Provider>{children}</AppContext.Provider>;
}
