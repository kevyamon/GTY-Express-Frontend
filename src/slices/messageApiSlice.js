import { apiSlice } from './apiSlice';
const MESSAGES_URL = '/api/messages';

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => ({ url: MESSAGES_URL }),
      providesTags: ['Conversation'],
    }),
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
      invalidatesTags: ['Conversation'],
    }),
    // NOUVELLE MUTATION
    deleteMessage: builder.mutation({
        query: (messageId) => ({
            url: `${MESSAGES_URL}/${messageId}`,
            method: 'DELETE',
        }),
        // On ne met pas d'invalidatesTags ici, le WebSocket s'en chargera
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useDeleteMessageMutation, // NOUVEL EXPORT
} = messageApiSlice;