import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isUpdateAvailable: false,
  isUpdateInProgress: false,
  // --- MODIFICATION : Ajout du nouvel état ---
  // Ce booléen nous servira de mémoire. Si l'utilisateur ferme le modal,
  // on passera cet état à 'true' pour lui rappeler gentiment plus tard.
  updateDeclined: false,
};

const pwaSlice = createSlice({
  name: 'pwa',
  initialState,
  reducers: {
    setUpdateAvailable: (state, action) => {
      state.isUpdateAvailable = action.payload;
      // Si une nouvelle mise à jour est disponible, on réinitialise le fait qu'il l'ait refusée.
      if (action.payload) {
        state.updateDeclined = false;
      }
    },
    setUpdateInProgress: (state, action) => {
      state.isUpdateInProgress = action.payload;
    },
    // --- MODIFICATION : Ajout de la nouvelle action ---
    setUpdateDeclined: (state, action) => {
      state.updateDeclined = action.payload;
    },
  },
});

export const { setUpdateAvailable, setUpdateInProgress, setUpdateDeclined } = pwaSlice.actions;

export default pwaSlice.reducer;