import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { io } from 'socket.io-client';
import { updateUserStatus } from './authSlice';

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
  tagTypes: ['Product', 'Order', 'User', 'Notification', 'Promotion', 'PromoBanner', 'Conversation', 'Message', 'Complaint'],
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

        socket.on('connect', () => { console.log('Socket.IO connecté !'); });
        socket.on('disconnect', () => { console.log('Socket.IO déconnecté.'); });

        socket.on('order_update', (data) => { dispatch(apiSlice.util.invalidateTags(['Order'])); });
        socket.on('notification', (data) => { dispatch(apiSlice.util.invalidateTags(['Notification'])); });
        socket.on('product_update', (data) => {
          dispatch(apiSlice.util.invalidateTags(['Product']));
          dispatch(apiSlice.util.invalidateTags([{ type: 'Product', id: data.productId }]));
        });
        socket.on('newMessage', (newMessage) => {
            dispatch(apiSlice.util.invalidateTags(['Conversation']));
            dispatch(apiSlice.util.invalidateTags([{ type: 'Message', id: newMessage.conversationId }]));
        });
        socket.on('conversationRead', (data) => {
            dispatch(apiSlice.util.invalidateTags(['Conversation']));
        });
        socket.on('messageDeleted', (data) => {
            dispatch(apiSlice.util.invalidateTags(['Conversation']));
            dispatch(apiSlice.util.invalidateTags([{ type: 'Message', id: data.conversationId }]));
        });
        socket.on('messageEdited', (editedMessage) => {
            dispatch(apiSlice.util.invalidateTags([{ type: 'Message', id: editedMessage.conversationId }]));
        });
        socket.on('status_update', (data) => {
            dispatch(updateUserStatus({ _id: getState().auth.userInfo._id, ...data }));
        });
        socket.on('new_complaint', (data) => {
            dispatch(apiSlice.util.invalidateTags(['Complaint']));
        });
        socket.on('complaint_update', () => {
            dispatch(apiSlice.util.invalidateTags(['Complaint']));
        });

        // NOUVEL ÉCOUTEUR
        socket.on('banner_update', () => {
            console.log('Mise à jour de la bannière reçue');
            dispatch(apiSlice.util.invalidateTags(['PromoBanner']));
        });

        await cacheEntryRemoved;
        socket.disconnect();
      },
    }),
  }),
});

export const { useSocketQuery } = apiSlice;