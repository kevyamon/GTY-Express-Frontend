import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isUpdateAvailable: false,
  isUpdateInProgress: false,
  // --- MODIFICATION : On remplace 'updateDeclined' par 'isModalOpen' ---
  // C'est beaucoup plus clair : un état pour la disponibilité, un état pour l'affichage du modal.
  isModalOpen: false, 
};

const pwaSlice = createSlice({
  name: 'pwa',
  initialState,
  reducers: {
    setUpdateAvailable: (state, action) => {
      state.isUpdateAvailable = action.payload;
    },
    setUpdateInProgress: (state, action) => {
      state.isUpdateInProgress = action.payload;
    },
    // --- MODIFICATION : Nouvelle action pour gérer le modal ---
    setIsModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
    // On retire l'ancienne action 'setUpdateDeclined'
  },
});

// On exporte la nouvelle action
export const { setUpdateAvailable, setUpdateInProgress, setIsModalOpen } = pwaSlice.actions;

export default pwaSlice.reducer;