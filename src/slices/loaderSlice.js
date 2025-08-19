import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  message: null, // On ajoute un champ pour le message
};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    // Le loader accepte maintenant un message optionnel
    showLoader: (state, action) => {
      state.isLoading = true;
      state.message = action.payload?.message || null;
    },
    // On s'assure de réinitialiser le message quand le loader est caché
    hideLoader: (state) => {
      state.isLoading = false;
      state.message = null;
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;

export default loaderSlice.reducer;