import { apiSlice } from './apiSlice';

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/api/notifications',
      providesTags: ['Notifications'],
    }),
    markAsRead: builder.mutation({
      query: () => ({
        url: '/api/notifications/mark-as-read',
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),
    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `/api/notifications/${notificationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApiSlice;