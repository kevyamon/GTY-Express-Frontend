import { apiSlice } from './apiSlice';
const ADMIN_URL = '/api/admin';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // --- NOUVELLE REQUÊTE POUR LE TABLEAU DE BORD ---
    getStats: builder.query({
      query: () => `${ADMIN_URL}/stats`,
      providesTags: ['User', 'Order', 'Product', 'Complaint', 'Promotion'],
      keepUnusedDataFor: 5,
    }),
    // --- FIN DE L'AJOUT ---
    getUsers: builder.query({
      query: () => `${ADMIN_URL}/users`,
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),
    updateUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `${ADMIN_URL}/users/${userId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['User'],
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, isAdmin }) => ({
        url: `${ADMIN_URL}/users/${userId}/role`,
        method: 'PUT',
        body: { isAdmin },
      }),
      invalidatesTags: ['User'],
    }),
    getComplaints: builder.query({
        query: () => `${ADMIN_URL}/complaints`,
        providesTags: ['Complaint'],
    }),
    deleteComplaint: builder.mutation({
        query: (id) => ({
            url: `${ADMIN_URL}/complaints/${id}`,
            method: 'DELETE',
        }),
    }),
    deleteAllComplaints: builder.mutation({
        query: () => ({
            url: `${ADMIN_URL}/complaints`,
            method: 'DELETE',
        }),
    }),
  }),
});

export const {
  useGetStatsQuery, // NOUVEL EXPORT
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useGetComplaintsQuery,
  useDeleteComplaintMutation,
  useDeleteAllComplaintsMutation,
} = adminApiSlice;