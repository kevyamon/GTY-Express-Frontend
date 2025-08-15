import { useState, useEffect } from 'react';
import { useGetVersionQuery } from '../slices/apiSlice';
import packageJson from '../../package.json';

const useVersionCheck = () => {
  const currentVersion = packageJson.version;
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState(currentVersion);
  // --- NOUVEL ÉTAT POUR STOCKER LA DATE ---
  const [deployedAt, setDeployedAt] = useState(null);

  // On interroge le serveur toutes les 60 secondes (polling)
  const { data: serverData } = useGetVersionQuery(undefined, {
    pollingInterval: 60000, // 60 secondes
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (serverData) {
      if (serverData.version !== currentVersion) {
        setIsUpdateAvailable(true);
        setLatestVersion(serverData.version);
      }
      // On met à jour la date de déploiement
      setDeployedAt(serverData.deployedAt);
    }
  }, [serverData, currentVersion]);

  const refreshApp = () => {
    window.location.reload();
  };

  // On retourne la nouvelle information
  return { isUpdateAvailable, currentVersion, latestVersion, deployedAt, refreshApp };
};

export default useVersionCheck;