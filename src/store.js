import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import cartSliceReducer from './slices/cartSlice'; // Importer le reducer du panier
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer, // L'ajouter ici
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
