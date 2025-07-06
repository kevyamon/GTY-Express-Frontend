import { apiSlice } from './apiSlice';
const NOTIFICATION_URL = '/api/notifications';

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: `${NOTIFICATION_URL}`,
        method: 'GET',
      }),
      providesTags: ['Notifications'],
    }),

    markAllAsRead: builder.mutation({
      query: () => ({
        url: `${NOTIFICATION_URL}/read-all`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),

    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `${NOTIFICATION_URL}/${notificationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApiSlice;