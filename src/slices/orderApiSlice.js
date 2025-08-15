import { apiSlice } from './apiSlice';
const ORDERS_URL = '/api/orders';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({ query: (order) => ({ url: ORDERS_URL, method: 'POST', body: order }), invalidatesTags: ['Order'] }),
    getOrderDetails: builder.query({ query: (id) => ({ url: `${ORDERS_URL}/${id}` }), providesTags: (result, error, id) => [{ type: 'Order', id }] }),
    payOrder: builder.mutation({ query: ({ orderId, details }) => ({ url: `${ORDERS_URL}/${orderId}/pay`, method: 'PUT', body: details }), invalidatesTags: (result, error, arg) => [{ type: 'Order', id: arg.orderId }] }),
    getPaypalClientId: builder.query({ query: () => ({ url: '/api/config/paypal' }) }),
    getMyOrders: builder.query({ query: () => ({ url: `${ORDERS_URL}/myorders` }), providesTags: ['Order'] }),
    
    // --- NOUVELLE REQUÊTE POUR L'HISTORIQUE COMPLET ---
    getMyPurchases: builder.query({
      query: () => ({ url: `${ORDERS_URL}/mypurchases` }),
      providesTags: ['Order'], // Partage le même tag pour rester synchronisé
    }),
    // --- FIN DE L'AJOUT ---

    getOrders: builder.query({ query: () => ({ url: ORDERS_URL }), providesTags: ['Order'] }),
    updateOrderStatus: builder.mutation({ query: ({ orderId, status, isPaid }) => ({ url: `${ORDERS_URL}/${orderId}/status`, method: 'PUT', body: { status, isPaid } }), invalidatesTags: (result, error, arg) => [{ type: 'Order', id: arg.orderId }] }),
    cancelOrder: builder.mutation({ query: (orderId) => ({ url: `${ORDERS_URL}/${orderId}/cancel`, method: 'PUT' }), invalidatesTags: ['Order'] }),
    deleteOrder: builder.mutation({ query: (orderId) => ({ url: `${ORDERS_URL}/${orderId}`, method: 'DELETE' }), invalidatesTags: ['Order'] }),

    // --- NOUVELLE MUTATION POUR VALIDER UN COUPON ---
    validateCoupon: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/validate-coupon`,
        method: 'POST',
        body: data,
      }),
    }),
    // --- FIN DE L'AJOUT ---
  }),
});

export const {
  useCreateOrderMutation, 
  useGetOrderDetailsQuery, 
  usePayOrderMutation, 
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useGetMyPurchasesQuery,
  useGetOrdersQuery, 
  useUpdateOrderStatusMutation, 
  useDeleteOrderMutation, 
  useCancelOrderMutation,
  useValidateCouponMutation, // Nouvel export
} = orderApiSlice;