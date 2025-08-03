import { apiSlice } from './apiSlice';
const COMPLAINTS_URL = '/api/complaints';

export const complaintApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createComplaint: builder.mutation({
      query: (data) => ({
        url: COMPLAINTS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Complaint'],
    }),
  }),
});

export const { useCreateComplaintMutation } = complaintApiSlice;