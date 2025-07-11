import { configureStore } from '@reduxjs/toolkit';
// On corrige le chemin ici pour pointer vers le dossier 'slices'
import { apiSlice } from './slices/apiSlice';
import cartSliceReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import favoritesReducer from './slices/favoritesSlice';
import { promotionApiSlice } from './slices/promotionApiSlice';
import { notificationApiSlice } from './slices/notificationApiSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [promotionApiSlice.reducerPath]: promotionApiSlice.reducer,
    [notificationApiSlice.reducerPath]: notificationApiSlice.reducer,
    cart: cartSliceReducer,
    auth: authReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, promotionApiSlice.middleware, notificationApiSlice.middleware),
  devTools: true,
});

export default store;