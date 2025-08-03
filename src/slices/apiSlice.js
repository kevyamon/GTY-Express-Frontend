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
  tagTypes: ['Product', 'Order', 'User', 'Notification', 'Promotion', 'PromoBanner', 'Conversation', 'Message'],
  endpoints: (builder) => ({
    socket: builder.query({
      queryFn: () => ({ data: 'connected' }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch, getState }
      ) {
        const socket = io(import.meta.env.VITE_BACKEND_URL, {
            query: { userId: getState().auth.userInfo?._id },
        });

        socket.on('connect', () => {
          console.log('Socket.IO connecté !');
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

        socket.on('product_update', (data) => {
          console.log('Événement product_update reçu', data);
          dispatch(apiSlice.util.invalidateTags(['Product']));
          dispatch(apiSlice.util.invalidateTags([{ type: 'Product', id: data.productId }]));
        });

        socket.on('newMessage', (newMessage) => {
            console.log('Nouveau message reçu en temps réel', newMessage);
            dispatch(apiSlice.util.invalidateTags(['Conversation']));
            dispatch(apiSlice.util.invalidateTags([{ type: 'Message', id: newMessage.conversationId }]));
        });

        // NOUVEL ÉCOUTEUR AJOUTÉ
        socket.on('conversationRead', (data) => {
            console.log('Conversation lue en temps réel', data);
            dispatch(apiSlice.util.invalidateTags(['Conversation']));
        });

        await cacheEntryRemoved;
        socket.disconnect();
      },
    }),
  }),
});

export const { useSocketQuery } = apiSlice;