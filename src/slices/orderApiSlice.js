import { apiSlice } from './apiSlice';
const ORDERS_URL = '/api/orders';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({ query: (order) => ({ url: ORDERS_URL, method: 'POST', body: order }), invalidatesTags: ['Order'] }),
    
    getOrderDetails: builder.query({ query: (id) => ({ url: `${ORDERS_URL}/${id}` }), providesTags: (result, error, id) => [{ type: 'Order', id }] }),
    
    // --- PAYPAL RETIRÉ ---
    // payOrder: builder.mutation(...)
    // getPaypalClientId: builder.query(...)
    
    // +++ CINETPAY AJOUTÉ +++
    initiateCinetpayPayment: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/pay-cinetpay`,
        method: 'POST',
      }),
      // Pas besoin de invalider les tags ici car cela déclenche une redirection
    }),
    
    getMyOrders: builder.query({ query: () => ({ url: `${ORDERS_URL}/myorders` }), providesTags: ['Order'] }),
    
    getMyPurchases: builder.query({
      query: () => ({ url: `${ORDERS_URL}/mypurchases` }),
      providesTags: ['Order'],
    }),
    
    getOrders: builder.query({ query: () => ({ url: ORDERS_URL }), providesTags: ['Order'] }),
    
    getArchivedOrders: builder.query({
      query: () => ({ url: `${ORDERS_-URL}/archived` }),
      providesTags: ['Order'],
    }),

    updateOrderStatus: builder.mutation({ query: ({ orderId, status, isPaid }) => ({ url: `${ORDERS_URL}/${orderId}/status`, method: 'PUT', body: { status, isPaid } }), invalidatesTags: (result, error, arg) => [{ type: 'Order', id: arg.orderId }] }),
    
    cancelOrder: builder.mutation({ query: (orderId) => ({ url: `${ORDERS_URL}/${orderId}/cancel`, method: 'PUT' }), invalidatesTags: ['Order'] }),
    
    deleteOrder: builder.mutation({ query: (orderId) => ({ url: `${ORDERS_URL}/${orderId}`, method: 'DELETE' }), invalidatesTags: ['Order'] }),

    validateCoupon: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/validate-coupon`,
        method: 'POST',
        body: data,
      }),
    }),

    archiveOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/archive`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation, 
  useGetOrderDetailsQuery, 
  // --- RETIRÉ ---
  // usePayOrderMutation, 
  // useGetPaypalClientIdQuery,
  
  // +++ AJOUTÉ +++
  useInitiateCinetpayPaymentMutation,
  
  useGetMyOrdersQuery,
  useGetMyPurchasesQuery,
  useGetOrdersQuery, 
  useGetArchivedOrdersQuery,
  useUpdateOrderStatusMutation, 
  useDeleteOrderMutation, 
  useCancelOrderMutation,
  useValidateCouponMutation,
  useArchiveOrderMutation,
} = orderApiSlice;