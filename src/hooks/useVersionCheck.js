// src/hooks/useVersionCheck.js

import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRegisterSW } from 'vite-plugin-pwa/react';
import { showLoader } from '../slices/loaderSlice';

export function useVersionCheck() {
  const dispatch = useDispatch();

  // --- On utilise le hook de vite-plugin-pwa ---
  const {
    needRefresh: [needRefresh], // nous dit quand une mise à jour est prête
    updateServiceWorker,       // la fonction pour appliquer la mise à jour
  } = useRegisterSW({
    onRegistered(r) {
      console.log('Service Worker enregistré.');
    },
    onRegisterError(error) {
      console.error('Erreur d\'enregistrement du Service Worker:', error);
    },
  });

  // --- Nos états restent les mêmes ---
  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateDeclined, setUpdateDeclined] = useState(false);
  const [newVersionInfo, setNewVersionInfo] = useState(null);
  const [showUpdateCompleteModal, setShowUpdateCompleteModal] = useState(false);

  useEffect(() => {
    const updateFlag = sessionStorage.getItem('pwaUpdateInProgress');
    if (updateFlag) {
      sessionStorage.removeItem('pwaUpdateInProgress');
      setShowUpdateCompleteModal(true);
    }
  }, []);

  // --- Ce useEffect se déclenche quand le Service Worker détecte une mise à jour ---
  useEffect(() => {
    if (needRefresh) {
      // On récupère les détails de la nouvelle version pour les afficher
      fetch(`/meta.json?t=${new Date().getTime()}`)
        .then(res => res.json())
        .then(meta => setNewVersionInfo(meta))
        .catch(err => console.error("Impossible de récupérer meta.json", err));
      
      setIsModalOpen(true); // On ouvre notre modal personnalisé
    }
  }, [needRefresh]);


  // --- LA CORRECTION CLÉ EST ICI ---
  const confirmUpdate = () => {
    setIsUpdateInProgress(true);
    dispatch(showLoader());
    sessionStorage.setItem('newAppVersion', newVersionInfo?.version || 'inconnue');
    sessionStorage.setItem('pwaUpdateInProgress', 'true');

    // Au lieu de window.location.reload(), on utilise la fonction du hook.
    // Elle va activer le nouveau Service Worker, qui rechargera ensuite la page.
    updateServiceWorker(true);
  };

  const declineUpdate = () => {
    setIsModalOpen(false);
    setUpdateDeclined(true);
  };

  const openUpdateModal = () => {
    if (needRefresh) {
      setIsModalOpen(true);
    }
  };

  return {
    isUpdateAvailable: needRefresh, // Notre "disponibilité" est maintenant directement liée à needRefresh
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