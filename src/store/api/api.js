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
  tagTypes: ['Users', 'Orders', 'Products', 'Stores', 'WarehouseRequests', 'Brands'],
  endpoints: builder => ({
    getAllOrders: builder.query({
      query: ({ page = 1, statuses, storeIds, startDate, endDate }) => ({
        url: '/orders/all',
        params: {
          page,
          statuses,
          storeIds,
          startDate,
          endDate,
        },
      }),
      providesTags: ['Orders'],
    }),
    createOrder: builder.mutation({
      query: data => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Orders'],
    }),
    processOrder: builder.mutation({
      query: data => ({
        url: '/orders/processing',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Orders'],
    }),
    sendOrder: builder.mutation({
      query: data => ({
        url: '/orders/send',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Orders'],
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
      query: ({ page = 1, statuses, date }) => ({
        url: '/orders',
        params: { page, statuses, date },
      }),
      providesTags: ['Orders'],
    }),
    getOrderById: builder.query({
      query: id => ({
        url: `/orders/${id}`,
      }),
      providesTags: ['Orders'],
    }),
    getAllProducts: builder.query({
      query: () => '/product',
      providesTags: ['Products'],
    }),
    getAllProductsByBrand: builder.query({
      query: () => '/product/brands',
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
    deleteUser: builder.mutation({
      query: id => ({
        url: '/users',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: ['Users'],
    }),
    resetUserPassword: builder.mutation({
      query: ({ id, password }) => ({
        url: '/auth/restore',
        method: 'POST',
        body: {
          userId: id,
          password,
        },
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
    getWarehouseRequests: builder.query({
      query: () => '/warehouse/requests',
      providesTags: ['WarehouseRequests'],
    }),
    getAdminWarehouseRequests: builder.query({
      query: () => '/warehouse/orders',
      providesTags: ['WarehouseRequests'],
    }),
    createWarehouseRequest: builder.mutation({
      query: data => ({
        url: '/warehouse',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['WarehouseRequests'],
    }),
    updateWarehouseRequestStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/warehouse/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['WarehouseRequests', 'Products'],
    }),
    getWarehouseRequestById: builder.query({
      query: id => `/warehouse/${id}`,
      providesTags: ['WarehouseRequests'],
    }),
    getAllBrands: builder.query({
      query: () => '/brands',
      providesTags: ['Brands'],
    }),
    createBrand: builder.mutation({
      query: name => ({
        url: '/brands',
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: ['Brands'],
    }),
    deleteBrand: builder.mutation({
      query: name => ({
        url: '/brands',
        method: 'DELETE',
        body: { name },
      }),
      invalidatesTags: ['Brands'],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useLoginMutation,
  useLogoutMutation,
  useGetMyOrdersQuery,
  useGetAllProductsQuery,
  useGetAllProductsByBrandQuery,
  useGetOrderByIdQuery,
  useUpdateProductsMutation,
  useAddProductMutation,
  useGetAllUsersQuery,
  useDeleteProductMutation,
  useGetAllStoresQuery,
  useCreateUserMutation,
  useCreateStoreMutation,
  useCreateOrderMutation,
  useProcessOrderMutation,
  useSendOrderMutation,
  useGetWarehouseRequestsQuery,
  useGetAdminWarehouseRequestsQuery,
  useCreateWarehouseRequestMutation,
  useUpdateWarehouseRequestStatusMutation,
  useGetWarehouseRequestByIdQuery,
  useDeleteUserMutation,
  useResetUserPasswordMutation,
  useGetAllBrandsQuery,
  useDeleteBrandMutation,
  useCreateBrandMutation,
} = api;
