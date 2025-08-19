import { apiSlice } from './apiSlice';
const MESSAGES_URL = '/api/messages';

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => ({ url: MESSAGES_URL }),
      providesTags: ['Conversation'],
    }),
    // --- DÉBUT DE L'AJOUT ---
    getArchivedConversations: builder.query({
      query: () => ({ url: `${MESSAGES_URL}/archived` }),
      providesTags: ['ArchivedConversation'], // On utilise un tag différent pour le cache
    }),
    archiveConversation: builder.mutation({
      query: (conversationId) => ({
        url: `${MESSAGES_URL}/archive/${conversationId}`,
        method: 'POST',
      }),
      // Invalide les deux listes pour forcer leur rafraîchissement
      invalidatesTags: ['Conversation', 'ArchivedConversation'], 
    }),
    // --- FIN DE L'AJOUT ---
    getMessages: builder.query({
      query: (conversationId) => ({ url: `${MESSAGES_URL}/${conversationId}` }),
      providesTags: (result, error, id) => [{ type: 'Message', id }],
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: `${MESSAGES_URL}/send`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Conversation', 'Message'],
    }),
    markAsRead: builder.mutation({
      query: (conversationId) => ({
        url: `${MESSAGES_URL}/read/${conversationId}`,
        method: 'POST',
      }),
    }),
    markAllAsRead: builder.mutation({
      query: () => ({
        url: `${MESSAGES_URL}/read-all`,
        method: 'POST',
      }),
      invalidatesTags: ['Conversation'],
    }),
    markMessagesAsSeen: builder.mutation({
      query: (conversationId) => ({
        url: `${MESSAGES_URL}/seen/${conversationId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Message', id }],
    }),
    deleteMessage: builder.mutation({
        query: (messageId) => ({
            url: `${MESSAGES_URL}/${messageId}`,
            method: 'DELETE',
        }),
    }),
    updateMessage: builder.mutation({
        query: ({ messageId, text }) => ({
            url: `${MESSAGES_URL}/${messageId}`,
            method: 'PUT',
            body: { text },
        }),
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetArchivedConversationsQuery, // Nouvel export
  useArchiveConversationMutation, // Nouvel export
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useMarkMessagesAsSeenMutation,
  useDeleteMessageMutation,
  useUpdateMessageMutation,
} = messageApiSlice;