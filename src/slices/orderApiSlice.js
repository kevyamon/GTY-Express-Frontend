import { apiSlice } from './apiSlice';
import { ORDERS_URL } from '../constants';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: order,
      }),
    }),
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    // --- DÉBUT DE LA MODIFICATION ---
    // La mutation payOrder et getPaypalClientId sont supprimées.
    // Elles sont remplacées par la nouvelle mutation pour CinetPay.

    initiateCinetpayPayment: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/pay-cinetpay`,
        method: 'POST',
      }),
    }),
    // --- FIN DE LA MODIFICATION ---
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/myorders`,
      }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status, isPaid }) => ({
        url: `${ORDERS_URL}/${orderId}/status`,
        method: 'PUT',
        body: { status, isPaid },
      }),
    }),
    archiveOrder: builder.mutation({
        query: (orderId) => ({
            url: `${ORDERS_URL}/${orderId}/archive`,
            method: 'PUT',
        }),
    }),
    getArchivedOrders: builder.query({
        query: () => ({
            url: `${ORDERS_URL}/archived`,
        }),
        keepUnusedDataFor: 5,
    }),
    validateCoupon: builder.mutation({
        query: (couponCode) => ({
            url: `${ORDERS_URL}/validate-coupon`,
            method: 'POST',
            body: { couponCode },
        })
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useUpdateOrderStatusMutation,
  useArchiveOrderMutation,
  useGetArchivedOrdersQuery,
  useValidateCouponMutation,
  useInitiateCinetpayPaymentMutation, // <-- On exporte le nouvel hook
} = orderApiSlice;