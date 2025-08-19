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

  // --- L'utilisateur confirme la mise à jour (LOGIQUE CORRIGÉE) ---
  const confirmUpdate = async () => {
    setIsUpdateInProgress(true);
    dispatch(showLoader({ message: "Veuillez patienter, cela peut prendre jusqu'à 3 minutes" }));
    
    // On stocke les infos pour après le rechargement
    sessionStorage.setItem('newAppVersion', newVersionInfo?.version || 'inconnue');
    sessionStorage.setItem('pwaUpdateInProgress', 'true');

    try {
      // On cherche et on désactive l'ancien Service Worker pour forcer le rechargement depuis le réseau
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }
    } catch (error) {
      console.error("Échec de la désinscription du service worker:", error);
      // On continue même si la désinscription échoue, le rechargement simple essaiera
    }

    // On attend un court instant pour s'assurer que tout est propre, puis on recharge.
    // Le nouveau Service Worker sera alors correctement enregistré.
    setTimeout(() => {
      window.location.reload();
    }, 1000); // 1 seconde est suffisante
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