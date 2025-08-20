import { apiSlice } from './apiSlice';
const SUGGESTIONS_URL = '/api/suggestions';

export const suggestionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createSuggestion: builder.mutation({
      query: (data) => ({
        url: SUGGESTIONS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Suggestion'],
    }),

    getMySuggestions: builder.query({
      query: () => ({
        url: `${SUGGESTIONS_URL}/mysuggestions`,
      }),
      providesTags: ['Suggestion'],
      keepUnusedDataFor: 5,
    }),

    updateSuggestion: builder.mutation({
      query: (data) => ({
        url: `${SUGGESTIONS_URL}/${data.suggestionId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Suggestion'],
    }),

    deleteSuggestion: builder.mutation({
      query: (suggestionId) => ({
        url: `${SUGGESTIONS_URL}/${suggestionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Suggestion'],
    }),

    // --- Pour l'admin ---

    getSuggestions: builder.query({
      query: () => ({
        url: SUGGESTIONS_URL,
      }),
      providesTags: ['Suggestion'],
      keepUnusedDataFor: 5,
    }),

    // --- NOUVEL ENDPOINT ---
    getArchivedSuggestions: builder.query({
      query: () => ({
        url: `${SUGGESTIONS_URL}/archived`,
      }),
      providesTags: ['Suggestion'],
      keepUnusedDataFor: 5,
    }),

    archiveSuggestion: builder.mutation({
      query: (suggestionId) => ({
        url: `${SUGGESTIONS_URL}/${suggestionId}/archive`,
        method: 'PUT',
      }),
      invalidatesTags: ['Suggestion'], // Invalide les deux listes (active et archivée)
    }),
  }),
});

export const {
  useCreateSuggestionMutation,
  useGetMySuggestionsQuery,
  useUpdateSuggestionMutation,
  useDeleteSuggestionMutation,
  useGetSuggestionsQuery,
  useGetArchivedSuggestionsQuery, // --- NOUVEL EXPORT ---
  useArchiveSuggestionMutation,
} = suggestionApiSlice;