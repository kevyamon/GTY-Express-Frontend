import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// On utilise l'URL du backend définie dans les variables d'environnement
const baseQuery = fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});
