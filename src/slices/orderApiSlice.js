import { apiSlice } from './apiSlice';
const ORDERS_URL = '/api/orders';
const PAYPAL_URL = '/api/config/paypal'; // On ajoute l'URL pour la clé PayPal

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({ url: ORDERS_URL, method: 'POST', body: order }),
    }),
    getOrderDetails: builder.query({
      query: (id) => ({ url: `${ORDERS_URL}/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Order', id }],
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({ // NOUVELLE FONCTION
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: details,
      }),
    }),
    getPaypalClientId: builder.query({ // NOUVELLE FONCTION
      query: () => ({ url: PAYPAL_URL }),
      keepUnusedDataFor: 5,
    }),
    getMyOrders: builder.query({
      query: () => ({ url: `${ORDERS_URL}/myorders` }),
      providesTags: ['Order'],
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({ url: ORDERS_URL }),
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status, isPaid }) => ({
        url: `${ORDERS_URL}/${orderId}/status`,
        method: 'PUT',
        body: { status, isPaid },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Order', id: arg.orderId }],
    }),
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
    }),
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation, // On exporte le nouveau hook
  useGetPaypalClientIdQuery, // On exporte le nouveau hook
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useCancelOrderMutation,
} = orderApiSlice;