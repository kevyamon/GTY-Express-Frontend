import { apiSlice } from './apiSlice';
const ADMIN_URL = '/api/admin';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
    // NOUVELLES MUTATIONS
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
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useGetComplaintsQuery,
  useDeleteComplaintMutation, // NOUVEL EXPORT
  useDeleteAllComplaintsMutation, // NOUVEL EXPORT
} = adminApiSlice;