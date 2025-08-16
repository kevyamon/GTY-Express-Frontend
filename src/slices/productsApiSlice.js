import { apiSlice } from './apiSlice';
const PRODUCTS_URL = '/api/products';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      // --- MODIFIÉ : On ajoute pageType pour pouvoir exclure des produits ---
      query: ({ keyword = '', category = '', promotion = 'false', pageType = '' }) => ({
        url: PRODUCTS_URL,
        params: { keyword, category, promotion, pageType },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({ url: `${PRODUCTS_URL}/${productId}` }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation({
      query: (data) => ({ url: PRODUCTS_URL, method: 'POST', body: data }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({ url: `${PRODUCTS_URL}/${data.productId}`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.productId }],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({ url: `${PRODUCTS_URL}/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.productId }],
    }),
    
    getTopProducts: builder.query({
      // --- MODIFIÉ : On peut maintenant passer une limite ---
      query: ({ limit } = {}) => ({
        url: `${PRODUCTS_URL}/top`,
        params: { limit },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),
    getPopularProducts: builder.query({
      // --- MODIFIÉ : On peut maintenant passer une limite ---
      query: ({ limit } = {}) => ({
        url: `${PRODUCTS_URL}/popular`,
        params: { limit },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetPopularProductsQuery,
} = productsApiSlice;