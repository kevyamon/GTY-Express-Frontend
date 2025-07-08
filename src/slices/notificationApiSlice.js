// src/slices/notificationApiSlice.js
import { apiSlice } from './apiSlice';

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/api/notifications',
      providesTags: ['Notification'],
      keepUnusedDataFor: 5,
    }),
    markAsRead: builder.mutation({
      query: () => ({ url: '/api/notifications/mark-as-read', method: 'PUT' }),
      invalidatesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation({
      query: (notificationId) => ({ url: `/api/notifications/${notificationId}`, method: 'DELETE' }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApiSlice;
