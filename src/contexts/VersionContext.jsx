import React, { createContext, useContext } from 'react';
import useVersionCheck from '../hooks/useVersionCheck';

const VersionContext = createContext();

export const useVersion = () => {
  return useContext(VersionContext);
};

export const VersionProvider = ({ children }) => {
  const versionInfo = useVersionCheck();

  return (
    <VersionContext.Provider value={versionInfo}>
      {children}
    </VersionContext.Provider>
  );
};