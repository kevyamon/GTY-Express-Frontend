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
  tagTypes: ['Product', 'Order', 'User', 'Notification', 'Promotion', 'PromoBanner'],
  endpoints: (builder) => ({
    socket: builder.query({
      queryFn: () => ({ data: 'connected' }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch, getState }
      ) {
        const socket = io(import.meta.env.VITE_BACKEND_URL);

        socket.on('connect', () => {
          console.log('Socket.IO connecté !');
          const { userInfo } = getState().auth;
          if (userInfo) {
            socket.emit('joinRoom', userInfo._id);
            if (userInfo.isAdmin) {
              socket.emit('joinRoom', 'admin');
            }
          }
        });

        socket.on('disconnect', () => {
          console.log('Socket.IO déconnecté.');
        });

        socket.on('order_update', (data) => {
          console.log('Événement order_update reçu', data);
          dispatch(apiSlice.util.invalidateTags(['Order']));
        });

        socket.on('notification', (data) => {
          console.log('Événement notification reçu', data);
          dispatch(apiSlice.util.invalidateTags(['Notification']));
        });

        // --- NOUVEL ÉCOUTEUR AJOUTÉ ICI ---
        socket.on('product_update', (data) => {
          console.log('Événement product_update reçu', data);
          // Rafraîchit la liste générale des produits
          dispatch(apiSlice.util.invalidateTags(['Product']));
          // Rafraîchit la page de détail du produit spécifique s'il est en cache
          dispatch(apiSlice.util.invalidateTags([{ type: 'Product', id: data.productId }]));
        });

        await cacheEntryRemoved;
        socket.disconnect();
      },
    }),
  }),
});

export const { useSocketQuery } = apiSlice;