import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import cartSliceReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import favoritesReducer from './slices/favoritesSlice';
import loaderReducer from './slices/loaderSlice';
// --- ON RETIRE L'ANCIEN IMPORT pwaReducer ---

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: authReducer,
    favorites: favoritesReducer,
    loader: loaderReducer,
    // --- ON RETIRE LA LIGNE pwa: pwaReducer ---
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;