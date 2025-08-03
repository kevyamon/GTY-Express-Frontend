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
    getComplaints: builder.query({
        query: () => `${ADMIN_URL}/complaints`,
        providesTags: ['Complaint'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useGetComplaintsQuery,
} = adminApiSlice;