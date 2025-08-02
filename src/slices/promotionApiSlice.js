import { apiSlice } from './apiSlice';
const PRODUCTS_URL = '/api/products';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword = '', category = '', promotion = 'false' }) => ({ // VALEUR PAR DEFAUT DE CATEGORY MISE A JOUR
        url: PRODUCTS_URL,
        params: { keyword, category, promotion },
      }),
      providesTags: ['Product'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({ url: `${PRODUCTS_URL}/${productId}` }),
    }),
    createProduct: builder.mutation({
      query: (data) => ({ url: PRODUCTS_URL, method: 'POST', body: data }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({ url: `${PRODUCTS_URL}/${data.productId}`, method: 'PUT', body: data }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({ url: `${PRODUCTS_URL}/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApiSlice;