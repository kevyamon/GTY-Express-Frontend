// src/hooks/useVersionCheck.js

import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { showLoader } from '../slices/loaderSlice';

const POLLING_INTERVAL = 1 * 60 * 1000; // 1 minute

export function useVersionCheck() {
  const dispatch = useDispatch();

  // --- États pour gérer tout le cycle de vie de la mise à jour ---
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateDeclined, setUpdateDeclined] = useState(false);
  const [newVersionInfo, setNewVersionInfo] = useState(null);

  // Nouvel état pour gérer le modal de succès post-mise à jour
  const [showUpdateCompleteModal, setShowUpdateCompleteModal] = useState(false);

  // Au chargement initial, on vérifie si une mise à jour vient de se terminer
  useEffect(() => {
    const updateFlag = sessionStorage.getItem('pwaUpdateInProgress');
    if (updateFlag) {
      sessionStorage.removeItem('pwaUpdateInProgress');
      setShowUpdateCompleteModal(true); // On affiche le modal de succès
    }
  }, []);

  // La fonction qui vérifie la version sur le serveur
  const performCheck = useCallback(async () => {
    const currentVersion = document.querySelector('meta[name="app-version"]')?.content;
    if (!currentVersion || isUpdateAvailable) return;

    try {
      const url = `/meta.json?t=${new Date().getTime()}`;
      const response = await fetch(url, { cache: 'no-store' });
      const meta = await response.json();
      
      if (meta.fullVersion !== currentVersion) {
        setNewVersionInfo(meta);
        setIsUpdateAvailable(true);
        setIsModalOpen(true); // Ouvre automatiquement le modal
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la version :", error);
    }
  }, [isUpdateAvailable]);

  // Le hook pour la vérification automatique
  useEffect(() => {
    const interval = setInterval(performCheck, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [performCheck]);

  // --- Fonctions pour gérer les actions de l'utilisateur ---

  // L'utilisateur clique sur "Mettre à jour maintenant"
  const confirmUpdate = () => {
    setIsUpdateInProgress(true);
    dispatch(showLoader()); // Affiche l'animation de chargement
    
    // On stocke la nouvelle version pour l'afficher après le rechargement
    sessionStorage.setItem('newAppVersion', newVersionInfo?.version || 'inconnue');
    sessionStorage.setItem('pwaUpdateInProgress', 'true');

    // On attend un peu pour que l'animation soit visible, puis on recharge
    setTimeout(() => {
      window.location.reload();
    }, 90000);
  };

  // L'utilisateur clique sur "Plus tard"
  const declineUpdate = () => {
    setIsModalOpen(false);
    setUpdateDeclined(true);
  };

  // Pour ouvrir manuellement le modal (depuis un bouton par exemple)
  const openUpdateModal = () => {
    if (isUpdateAvailable) {
      setIsModalOpen(true);
    }
  };

  // On retourne tous les états et fonctions nécessaires pour les composants
  return {
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
}