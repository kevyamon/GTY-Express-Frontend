import { createContext } from 'react';

// On crée le contexte avec des valeurs par défaut.
// C'est la "forme" des données que nos composants vont pouvoir utiliser.
export const VersionContext = createContext({
  isUpdateAvailable: false,    // Une mise à jour est-elle prête ?
  isUpdateInProgress: false,   // La mise à jour est-elle en cours d'installation ?
  isModalOpen: false,          // Le modal de proposition doit-il être visible ?
  updateDeclined: false,       // L'utilisateur a-t-il cliqué sur "Plus tard" ?
  confirmUpdate: () => {},     // La fonction pour lancer la mise à jour.
  declineUpdate: () => {},     // La fonction pour refuser la mise à jour pour le moment.
  openUpdateModal: () => {},   // La fonction pour rouvrir le modal depuis le header.
});