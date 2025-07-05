import { apiSlice } from './apiSlice';
const ORDERS_URL = '/api/orders';
const PAYPAL_URL = '/api/config/paypal';

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
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: details,
      }),
      // CORRECTION : On invalide le cache de cette commande pour forcer le rafraîchissement
      invalidatesTags: (result, error, arg) => [{ type: 'Order', id: arg.orderId }],
    }),
    getPaypalClientId: builder.query({
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
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useCancelOrderMutation,
} = orderApiSlice;