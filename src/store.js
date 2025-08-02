import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import cartSliceReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import favoritesReducer from './slices/favoritesSlice';
import { promotionApiSlice } from './slices/promotionApiSlice';
import { notificationApiSlice } from './slices/notificationApiSlice';
import { promoBannerApiSlice } from './slices/promoBannerApiSlice'; // NOUVEL IMPORT

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    // On n'a plus besoin de déclarer les autres slices d'API ici, car elles sont injectées
    cart: cartSliceReducer,
    auth: authReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // apiSlice gère tous les middlewares d'API
  devTools: true,
});

export default store;