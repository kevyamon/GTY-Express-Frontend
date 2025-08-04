import { apiSlice } from './apiSlice';
const PROMO_BANNER_URL = '/api/promobanner';

export const promoBannerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActiveBanner: builder.query({
      query: () => ({ url: `${PROMO_BANNER_URL}/active` }),
      providesTags: ['PromoBanner'],
    }),
    getAllBanners: builder.query({
      query: () => ({ url: PROMO_BANNER_URL }),
      providesTags: ['PromoBanner'],
    }),
    createBanner: builder.mutation({
      query: (data) => ({
        url: PROMO_BANNER_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PromoBanner'],
    }),
    // NOUVELLE MUTATION
    updateBanner: builder.mutation({
      query: (data) => ({
        url: `${PROMO_BANNER_URL}/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['PromoBanner'],
    }),
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `${PROMO_BANNER_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PromoBanner'],
    }),
  }),
});

export const {
  useGetActiveBannerQuery,
  useGetAllBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation, // NOUVEL EXPORT
  useDeleteBannerMutation,
} = promoBannerApiSlice;