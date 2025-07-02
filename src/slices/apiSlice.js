import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  // On prépare les en-têtes de la requête ici
  prepareHeaders: (headers, { getState }) => {
    // On récupère les informations de l'utilisateur depuis le state Redux
    const { userInfo } = getState().auth;
    // Si l'utilisateur est connecté, on ajoute son token dans l'en-tête "Authorization"
    if (userInfo && userInfo.token) {
      headers.set('authorization', `Bearer ${userInfo.token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});
