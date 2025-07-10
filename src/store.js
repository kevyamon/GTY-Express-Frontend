import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import cartSliceReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import favoritesReducer from './slices/favoritesSlice';

const store = configureStore({
  reducer: {
    // Tous les reducers de nos API sont gérés par cette seule ligne
    [apiSlice.reducerPath]: apiSlice.reducer,
    
    // Nos reducers "classiques"
    cart: cartSliceReducer,
    auth: authReducer,
    favorites: favoritesReducer,
  },
  // On ne déclare que le middleware de l'apiSlice principal
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;