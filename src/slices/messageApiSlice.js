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
    }),
    // NOUVELLE MUTATION
    markAllAsRead: builder.mutation({
      query: () => ({
        url: `${MESSAGES_URL}/read-all`,
        method: 'POST',
      }),
      invalidatesTags: ['Conversation'],
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
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation, // NOUVEL EXPORT
  useDeleteMessageMutation,
  useUpdateMessageMutation,
} = messageApiSlice;