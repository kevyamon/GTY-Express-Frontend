import { apiSlice } from './apiSlice';
const SUGGESTIONS_URL = '/api/suggestions';

// On injecte les nouveaux endpoints dans notre apiSlice principal
export const suggestionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Pour l'utilisateur : créer une suggestion
    createSuggestion: builder.mutation({
      query: (data) => ({
        url: SUGGESTIONS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Suggestion'], // Rafraîchit la liste des suggestions de l'utilisateur
    }),

    // Pour l'utilisateur : récupérer ses propres suggestions
    getMySuggestions: builder.query({
      query: () => ({
        url: `${SUGGESTIONS_URL}/mysuggestions`,
      }),
      providesTags: ['Suggestion'], // Met en cache les données avec ce tag
      keepUnusedDataFor: 5,
    }),

    // Pour l'utilisateur : mettre à jour sa suggestion
    updateSuggestion: builder.mutation({
      query: (data) => ({
        url: `${SUGGESTIONS_URL}/${data.suggestionId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Suggestion'],
    }),

    // Pour l'utilisateur : supprimer sa suggestion
    deleteSuggestion: builder.mutation({
      query: (suggestionId) => ({
        url: `${SUGGESTIONS_URL}/${suggestionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Suggestion'],
    }),

    // --- Pour l'admin ---

    // Pour l'admin : récupérer toutes les suggestions
    getSuggestions: builder.query({
      query: () => ({
        url: SUGGESTIONS_URL,
      }),
      providesTags: ['Suggestion'],
      keepUnusedDataFor: 5,
    }),

    // Pour l'admin : archiver une suggestion
    archiveSuggestion: builder.mutation({
      query: (suggestionId) => ({
        url: `${SUGGESTIONS_URL}/${suggestionId}/archive`,
        method: 'PUT',
      }),
      // On invalide le tag pour que la liste se mette à jour côté admin
      invalidatesTags: (result, error, arg) => [{ type: 'Suggestion', id: arg }],
    }),
  }),
});

// On exporte les "hooks" générés automatiquement pour pouvoir les utiliser dans nos composants
export const {
  useCreateSuggestionMutation,
  useGetMySuggestionsQuery,
  useUpdateSuggestionMutation,
  useDeleteSuggestionMutation,
  useGetSuggestionsQuery,
  useArchiveSuggestionMutation,
} = suggestionApiSlice;