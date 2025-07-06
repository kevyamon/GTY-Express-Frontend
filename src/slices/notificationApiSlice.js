import { apiSlice } from './apiSlice';

const NOTIFICATIONS_URL = '/api/notifications';

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => NOTIFICATIONS_URL,
      providesTags: ['Notifications'],
      pollingInterval: 5000, // mis à jour pour 5 secondes
    }),
    markAsRead: builder.mutation({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/mark-as-read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `${NOTIFICATIONS_URL}/${id}`,
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