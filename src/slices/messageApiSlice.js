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
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} = messageApiSlice;