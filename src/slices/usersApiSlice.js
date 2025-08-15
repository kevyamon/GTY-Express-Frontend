import { apiSlice } from './apiSlice';
import { showLoader, hideLoader } from './loaderSlice'; // --- NOUVEL IMPORT ---
const USERS_URL = '/api/users';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({ 
      query: (data) => ({ 
        url: `${USERS_URL}/login`, 
        method: 'POST', 
        body: data 
      }),
      // --- AJOUT POUR LE LOADER ---
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        dispatch(showLoader()); // Affiche l'animation
        try {
          await queryFulfilled;
        } finally {
          dispatch(hideLoader()); // Cache l'animation à la fin
        }
      },
      // --- FIN DE L'AJOUT ---
    }),
    register: builder.mutation({ 
      query: (data) => ({ 
        url: `${USERS_URL}/register`, 
        method: 'POST', 
        body: data 
      }),
      // --- AJOUT POUR LE LOADER ---
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        dispatch(showLoader()); // Affiche l'animation
        try {
          await queryFulfilled;
        } finally {
          dispatch(hideLoader()); // Cache l'animation à la fin
        }
      },
      // --- FIN DE L'AJOUT ---
    }),
    logout: builder.mutation({ 
      query: () => ({ 
        url: `${USERS_URL}/logout`, 
        method: 'POST' 
      }) 
    }),
    getProfileDetails: builder.query({ 
      query: () => ({ 
        url: `${USERS_URL}/profile` 
      }), 
      providesTags: ['User'] 
    }),
    updateProfile: builder.mutation({ 
      query: (data) => ({ 
        url: `${USERS_URL}/profile`, 
        method: 'PUT', 
        body: data 
      }), 
      invalidatesTags: ['User'] 
    }),
  }),
});

export const {
  useLoginMutation, 
  useLogoutMutation, 
  useRegisterMutation,
  useUpdateProfileMutation, 
  useGetProfileDetailsQuery,
} = usersApiSlice;