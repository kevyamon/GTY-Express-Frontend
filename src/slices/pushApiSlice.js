import { apiSlice } from './apiSlice';

const PUSH_URL = '/api/push';

export const pushApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVapidPublicKey: builder.query({
      query: () => ({ url: `${PUSH_URL}/vapid-public-key` }),
    }),
    subscribeToPush: builder.mutation({
      query: (subscription) => ({
        url: `${PUSH_URL}/subscribe`,
        method: 'POST',
        body: subscription,
      }),
    }),
  }),
});

export const { useGetVapidPublicKeyQuery, useSubscribeToPushMutation } = pushApiSlice;