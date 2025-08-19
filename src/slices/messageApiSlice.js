import { apiSlice } from './apiSlice';
const MESSAGES_URL = '/api/messages';

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => ({ url: MESSAGES_URL }),
      providesTags: ['Conversation'],
    }),
    // --- NOUVELLE REQUÊTE POUR LES ARCHIVES (ADMIN) ---
    getArchivedConversations: builder.query({
      query: () => ({ url: `${MESSAGES_URL}/archived` }),
      providesTags: ['Conversation'],
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
      // --- AJOUT : Invalider le tag pour rafraîchir la liste ---
      invalidatesTags: ['Conversation'],
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
    // --- NOUVELLE MUTATION POUR ARCHIVER/DÉSARCHIVER ---
    archiveConversation: builder.mutation({
        query: (conversationId) => ({
            url: `${MESSAGES_URL}/${conversationId}/archive`,
            method: 'PUT',
        }),
        invalidatesTags: ['Conversation'],
    }),
    // --- FIN DE L'AJOUT ---
  }),
});

export const {
  useGetConversationsQuery,
  useGetArchivedConversationsQuery, // Nouvel export
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useMarkMessagesAsSeenMutation,
  useDeleteMessageMutation,
  useUpdateMessageMutation,
  useArchiveConversationMutation, // Nouvel export
} = messageApiSlice;