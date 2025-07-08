import { apiSlice } from './apiSlice';
const NOTIFICATIONS_URL = '/api/notifications';

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: NOTIFICATIONS_URL,
      }),
      providesTags: ['Notification'],
    }),
    markAsRead: builder.mutation({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/mark-as-read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
    deleteAllNotifications: builder.mutation({
      query: () => ({
        url: NOTIFICATIONS_URL,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteAllNotificationsMutation,
} = notificationApiSlice;