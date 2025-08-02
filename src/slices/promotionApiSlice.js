import { apiSlice } from './apiSlice';
const PROMOTIONS_URL = '/api/promotions';

export const promotionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPromotions: builder.query({
      query: () => ({
        url: PROMOTIONS_URL,
      }),
      providesTags: ['Promotion'],
      keepUnusedDataFor: 5,
    }),
    createPromotion: builder.mutation({
      query: (data) => ({
        url: PROMOTIONS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Promotion'],
    }),
    // RENOMMÉ ICI
    removePromotion: builder.mutation({
      query: (id) => ({
        url: `${PROMOTIONS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Promotion'],
    }),
  }),
});

export const {
  useGetPromotionsQuery,
  useCreatePromotionMutation,
  useRemovePromotionMutation, // ET ICI
} = promotionApiSlice;