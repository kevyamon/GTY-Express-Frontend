import { apiSlice } from './apiSlice';
const WARNINGS_URL = '/api/warnings';

export const warningsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createWarning: builder.mutation({
      query: (data) => ({
        url: WARNINGS_URL,
        method: 'POST',
        body: data,
      }),
      // Pas besoin d'invalidateTags ici, car la notif est gérée par WebSocket
    }),
    getMyWarnings: builder.query({
      query: () => ({
        url: `${WARNINGS_URL}/mywarnings`,
      }),
      providesTags: ['Warning'], // Ce tag permettra de rafraîchir la liste automatiquement
    }),
    dismissWarning: builder.mutation({
      query: (warningId) => ({
        url: `${WARNINGS_URL}/${warningId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Warning'], // Rafraîchit la liste quand un avertissement est fermé
    }),
  }),
});

export const {
  useCreateWarningMutation,
  useGetMyWarningsQuery,
  useDismissWarningMutation,
} = warningsApiSlice;