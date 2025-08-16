import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { io } from 'socket.io-client';
import { updateUserStatus, updateUserRole } from './authSlice';
import { toast } from 'react-toastify';

// --- MODIFICATION : On remplace la variable par l'adresse directe du backend ---
const BACKEND_URL = 'https://gty-express.onrender.com';

const baseQuery = fetchBaseQuery({
  // On utilise notre constante ici pour être sûr de toujours viser la bonne adresse.
  baseUrl: BACKEND_URL,
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
  tagTypes: ['Product', 'Order', 'User', 'Notification', 'Promotion', 'PromoBanner', 'Conversation', 'Message', 'Complaint', 'Warning', 'Suggestion', 'Version', 'GlobalMessage'],
  endpoints: (builder) => ({
    getVersion: builder.query({
      query: () => '/api/version',
      providesTags: ['Version'],
    }),

    socket: builder.query({
      queryFn: () => ({ data: 'connected' }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch, getState }
      ) {
        // Le socket se connecte aussi directement à l'adresse du backend.
        const socket = io(BACKEND_URL);

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
        
        socket.on('new_global_message', (data) => {
          console.log('Nouveau message global reçu:', data);
          toast.info("Une nouvelle annonce est disponible !", { autoClose: 5000 });
          dispatch(apiSlice.util.invalidateTags(['GlobalMessage']));
        });

        socket.on('new_warning', (data) => {
          console.log('Nouvel avertissement reçu:', data);
          toast.warn('Vous avez reçu un nouvel avertissement d\'un administrateur.');
          dispatch(apiSlice.util.invalidateTags(['Warning']));
        });
        
        socket.on('suggestion_update', () => {
          dispatch(apiSlice.util.invalidateTags(['Suggestion']));
        });

        socket.on('new_user_registered', (data) => {
          console.log('Nouvel utilisateur enregistré:', data);
          toast.info(`🎉 ${data.name} a rejoint GTY Express !`);
          dispatch(apiSlice.util.invalidateTags(['User']));
        });

        socket.on('order_update', (data) => {
          dispatch(apiSlice.util.invalidateTags(['Order']));
        });

        socket.on('notification', (data) => {
          dispatch(apiSlice.util.invalidateTags(['Notification']));
        });

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

        socket.on('banner_update', () => {
            dispatch(apiSlice.util.invalidateTags(['PromoBanner']));
        });

        socket.on('messagesSeen', (data) => {
            dispatch(apiSlice.util.invalidateTags([{ type: 'Message', id: data.conversationId }]));
        });

        socket.on('allConversationsRead', () => {
            dispatch(apiSlice.util.invalidateTags(['Conversation']));
        });

        socket.on('role_update', (data) => {
            toast.info(data.message);
            dispatch(updateUserRole({ userId: getState().auth.userInfo._id, isAdmin: data.isAdmin }));
        });

        await cacheEntryRemoved;
        socket.disconnect();
      },
    }),
  }),
});

export const { useSocketQuery, useGetVersionQuery } = apiSlice;