import { apiSlice } from './apiSlice';
const NOTIFICATIONS_URL = '/api/notifications';

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: NOTIFICATIONS_URL,
      }),
      keepUnusedDataFor: 5,
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
  }),
});

// LA CORRECTION EST SUR LA LIGNE SUIVANTE
export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation, // L'exportation était manquante ou incorrecte
  useDeleteNotificationMutation,
} = notificationApiSlice;