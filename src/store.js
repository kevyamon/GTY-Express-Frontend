import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import cartSliceReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import favoritesReducer from './slices/favoritesSlice';
import { notificationApiSlice } from './slices/notificationApiSlice'; // On importe l'API des notifs

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [notificationApiSlice.reducerPath]: notificationApiSlice.reducer, // On déclare son reducer
    cart: cartSliceReducer,
    auth: authReducer,
    favorites: favoritesReducer,
  },
  // On ajoute le middleware des notifications à la chaîne
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, notificationApiSlice.middleware),
  devTools: true,
});

export default store;