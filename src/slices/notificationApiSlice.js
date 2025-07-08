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
    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `${NOTIFICATIONS_URL}/${notificationId}`,
        method: 'DELETE',
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
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation, // CORRECTION : On l'ajoute à la liste
} = notificationApiSlice;