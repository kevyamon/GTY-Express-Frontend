import { apiSlice } from './apiSlice';
const GLOBAL_MESSAGES_URL = '/api/global-messages';

export const globalMessageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Pour l'admin : créer un message global
    createGlobalMessage: builder.mutation({
      query: (data) => ({
        url: GLOBAL_MESSAGES_URL,
        method: 'POST',
        body: data,
      }),
      // Pas besoin d'invalidatesTags, la mise à jour se fait via WebSocket
    }),

    // Pour le client : récupérer le message actif à afficher
    getActiveGlobalMessage: builder.query({
      query: () => ({
        url: `${GLOBAL_MESSAGES_URL}/active`,
      }),
      providesTags: ['GlobalMessage'], // Ce tag permettra de rafraîchir
    }),

    // Pour le client : fermer le message
    dismissGlobalMessage: builder.mutation({
      query: (messageId) => ({
        url: `${GLOBAL_MESSAGES_URL}/${messageId}/dismiss`,
        method: 'PUT',
      }),
      invalidatesTags: ['GlobalMessage'], // Rafraîchit pour faire disparaître le message
    }),
  }),
});

export const {
  useCreateGlobalMessageMutation,
  useGetActiveGlobalMessageQuery,
  useDismissGlobalMessageMutation,
} = globalMessageApiSlice;