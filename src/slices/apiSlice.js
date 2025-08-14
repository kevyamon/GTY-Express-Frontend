import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { io } from 'socket.io-client';
import { updateUserStatus, updateUserRole } from './authSlice';
import { toast } from 'react-toastify';

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

        // --- NOUVEL ÉCOUTEUR POUR LE TOAST D'INSCRIPTION ---
        socket.on('new_user_registered', (data) => {
            console.log('Nouvel utilisateur enregistré:', data);
            toast.info(`🎉 ${data.name} a rejoint GTY Express !`);
            dispatch(apiSlice.util.invalidateTags(['User']));
        });
        // --- FIN DE L'AJOUT ---

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

        socket.on('conversationRead', (data) => {
            console.log('Conversation lue en temps réel', data);
            dispatch(apiSlice.util.invalidateTags(['Conversation']));
        });

        socket.on('messageDeleted', (data) => {
            console.log('Message supprimé en temps réel', data);
            dispatch(apiSlice.util.invalidateTags(['Conversation']));
            dispatch(apiSlice.util.invalidateTags([{ type: 'Message', id: data.conversationId }]));
        });

        socket.on('messageEdited', (editedMessage) => {
            console.log('Message modifié en temps réel', editedMessage);
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

        socket.on('banner_update', () => {
            console.log('Mise à jour de la bannière reçue');
            dispatch(apiSlice.util.invalidateTags(['PromoBanner']));
        });

        socket.on('messagesSeen', (data) => {
            console.log('Messages vus en temps réel', data);
            dispatch(apiSlice.util.invalidateTags([{ type: 'Message', id: data.conversationId }]));
        });

        socket.on('allConversationsRead', () => {
            dispatch(apiSlice.util.invalidateTags(['Conversation']));
        });

        socket.on('role_update', (data) => {
            console.log('Mise à jour du rôle reçue', data);
            toast.info(data.message);
            dispatch(updateUserRole({ userId: getState().auth.userInfo._id, isAdmin: data.isAdmin }));
        });

        await cacheEntryRemoved;
        socket.disconnect();
      },
    }),
  }),
});

export const { useSocketQuery } = apiSlice;