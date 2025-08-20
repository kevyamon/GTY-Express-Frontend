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
    // --- NOUVELLE MUTATION AJOUTÉE ---
    unsubscribeFromPush: builder.mutation({
      query: (data) => ({
        url: `${PUSH_URL}/unsubscribe`,
        method: 'POST',
        body: data,
      }),
    }),
    // --- FIN DE L'AJOUT ---
  }),
});

export const { 
  useGetVapidPublicKeyQuery, 
  useSubscribeToPushMutation,
  useUnsubscribeFromPushMutation, // --- Nouvel export
} = pushApiSlice;