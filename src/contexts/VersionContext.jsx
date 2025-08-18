// src/contexts/VersionContext.jsx

import React, { createContext } from 'react';
import { useVersionCheck } from '../hooks/useVersionCheck';

// 1. On crée et on exporte le Contexte
export const VersionContext = createContext();

// 2. On crée et on exporte le Provider dans le même fichier
export const VersionProvider = ({ children }) => {
  // On récupère TOUT l'état et TOUTES les fonctions depuis notre hook centralisé.
  const {
    isUpdateAvailable,
    isUpdateInProgress,
    isModalOpen,
    updateDeclined,
    newVersionInfo, // On récupère aussi les infos de la nouvelle version
    showUpdateCompleteModal,
    setShowUpdateCompleteModal,
    confirmUpdate,
    declineUpdate,
    openUpdateModal,
  } = useVersionCheck();

  // On crée l'objet "value" qui sera passé au contexte.
  // Il contient toutes les informations et fonctions nécessaires.
  const value = {
    isUpdateAvailable,
    isUpdateInProgress,
    isModalOpen,
    updateDeclined,
    newVersionInfo,
    showUpdateCompleteModal,
    setShowUpdateCompleteModal,
    confirmUpdate,
    declineUpdate,
    openUpdateModal,
  };

  // Le Provider ne fait que "fournir" les données, il n'affiche plus de modals lui-même.
  // C'est plus propre et c'est le rôle de App.jsx de gérer l'affichage.
  return (
    <VersionContext.Provider value={value}>
      {children}
    </VersionContext.Provider>
  );
};