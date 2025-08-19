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

  // --- Vérification si une mise à jour vient de se terminer ---
  useEffect(() => {
    const updateFlag = sessionStorage.getItem('pwaUpdateInProgress');
    if (updateFlag) {
      sessionStorage.removeItem('pwaUpdateInProgress');
      setShowUpdateCompleteModal(true); // On affiche le modal de succès
    }
  }, []);

  // --- Vérification de la version côté serveur ---
  const performCheck = useCallback(async () => {
    const currentVersion = document.querySelector('meta[name="app-version"]')?.content;
    if (!currentVersion || isUpdateAvailable) return;

    try {
      // On ajoute un paramètre timestamp pour forcer à ignorer le cache
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

  // --- Vérification automatique à intervalle régulier ---
  useEffect(() => {
    const interval = setInterval(performCheck, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [performCheck]);

  // --- Fonction utilitaire : recharger sans cache ---
  const reloadWithoutCache = () => {
    // On ajoute un paramètre unique (timestamp) à l’URL
    // Ainsi, le navigateur est obligé de recharger depuis le serveur
    const { pathname, search, hash } = window.location;
    const newUrl = `${pathname}?nocache=${Date.now()}${search}${hash}`;
    window.location.replace(newUrl);
  };

  // --- L'utilisateur confirme la mise à jour ---
  const confirmUpdate = () => {
    setIsUpdateInProgress(true);

    // On affiche le loader avec un message explicite
    dispatch(showLoader({ message: "Veuillez patienter, cela peut prendre jusqu'à 3 minutes" }));
    
    // On stocke la nouvelle version pour l’afficher après rechargement
    sessionStorage.setItem('newAppVersion', newVersionInfo?.version || 'inconnue');
    sessionStorage.setItem('pwaUpdateInProgress', 'true');

    // On attend 90 secondes avant de recharger la page
    setTimeout(() => {
      reloadWithoutCache(); // <--- On recharge sans utiliser le cache
    }, 90000);
  };

  // --- L'utilisateur refuse la mise à jour ---
  const declineUpdate = () => {
    setIsModalOpen(false);
    setUpdateDeclined(true);
  };

  // --- Ouverture manuelle du modal (si besoin) ---
  const openUpdateModal = () => {
    if (isUpdateAvailable) {
      setIsModalOpen(true);
    }
  };

  // --- Retour des états et fonctions pour les composants ---
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
