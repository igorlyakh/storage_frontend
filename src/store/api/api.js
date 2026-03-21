import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Users', 'Orders', 'Products', 'Stores'],
  endpoints: builder => ({
    getAllOrders: builder.query({
      query: () => '/orders/all',
      providesTags: ['Orders'],
    }),
    login: builder.mutation({
      query: data => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getMyOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Orders'],
    }),
    getOrderById: builder.query({
      query: id => ({
        url: `/orders/${id}`,
      }),
    }),
    getAllProducts: builder.query({
      query: () => '/product',
      providesTags: ['Products'],
    }),
    updateProducts: builder.mutation({
      query: data => ({
        url: `/product/${data.id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    addProduct: builder.mutation({
      query: data => ({
        url: '/product',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    getAllUsers: builder.query({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    createUser: builder.mutation({
      query: data => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),
    deleteProduct: builder.mutation({
      query: id => ({
        url: '/product',
        method: 'DELETE',
        body: id,
      }),
      invalidatesTags: ['Products'],
    }),
    getAllStores: builder.query({
      query: () => '/stores',
      providesTags: ['Stores'],
    }),
    createStore: builder.mutation({
      query: data => ({
        url: '/stores',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Stores'],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useLoginMutation,
  useLogoutMutation,
  useGetMyOrdersQuery,
  useGetAllProductsQuery,
  useGetOrderByIdQuery,
  useUpdateProductsMutation,
  useAddProductMutation,
  useGetAllUsersQuery,
  useDeleteProductMutation,
  useGetAllStoresQuery,
  useCreateUserMutation,
  useCreateStoreMutation,
} = api;
