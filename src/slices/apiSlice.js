import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { io } from 'socket.io-client';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  prepareHeaders: (headers, { getState }) => {
    const { userInfo } = getState().auth;
    if (userInfo && userInfo.token) {
      headers.set('authorization', `Bearer ${userInfo.token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User', 'Notification', 'Promotion'],
  endpoints: (builder) => ({
    // Endpoint "virtuel" pour gérer le cycle de vie de la connexion WebSocket
    socket: builder.query({
      queryFn: () => ({ data: 'connected' }), // Ne fait pas de vraie requête HTTP
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch, getState }
      ) {
        const socket = io(import.meta.env.VITE_BACKEND_URL);

        socket.on('connect', () => {
          console.log('Socket.IO connecté !');
          const { userInfo } = getState().auth;
          if (userInfo) {
            // L'utilisateur rejoint une "room" basée sur son ID pour les notifications personnelles
            socket.emit('joinRoom', userInfo._id);
            // L'admin rejoint aussi une room "admin"
            if (userInfo.isAdmin) {
              socket.emit('joinRoom', 'admin');
            }
          }
        });

        socket.on('disconnect', () => {
          console.log('Socket.IO déconnecté.');
        });

        // Listener pour les mises à jour de commandes
        socket.on('order_update', (data) => {
          console.log('Événement order_update reçu', data);
          // Invalide le cache pour les commandes, ce qui déclenche un refetch automatique
          dispatch(apiSlice.util.invalidateTags(['Order']));
        });

        // Listener pour les nouvelles notifications
        socket.on('notification', (data) => {
          console.log('Événement notification reçu', data);
           // Invalide le cache pour les notifications
          dispatch(apiSlice.util.invalidateTags(['Notification']));
        });

        // Attend que la connexion soit fermée pour nettoyer
        await cacheEntryRemoved;
        socket.disconnect();
      },
    }),
  }),
});

// Exporte le hook pour démarrer la connexion
export const { useSocketQuery } = apiSlice;