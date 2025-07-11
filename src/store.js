import { apiSlice } from './apiSlice';
const PROMOTIONS_URL = '/api/promotions';

export const promotionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPromotions: builder.query({
      query: () => ({ url: PROMOTIONS_URL }),
      providesTags: ['Promotion'],
      keepUnusedDataFor: 5,
    }),
    createPromotion: builder.mutation({
      query: (data) => ({ url: PROMOTIONS_URL, method: 'POST', body: data }),
      invalidatesTags: ['Promotion'],
    }),
    deletePromotion: builder.mutation({
      query: (promoId) => ({ url: `${PROMOTIONS_URL}/${promoId}`, method: 'DELETE' }),
      invalidatesTags: ['Promotion'],
    }),
  }),
});

export const { useGetPromotionsQuery, useCreatePromotionMutation, useDeletePromotionMutation } = promotionApiSlice;