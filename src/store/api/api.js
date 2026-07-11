import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { logOut, updateToken } from '../userSlice/userSlice';

const mutex = new Mutex();
const apiUrl = '/api';

const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().user.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
          },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          api.dispatch(updateToken(refreshResult.data.accessToken));
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logOut());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Users',
    'Orders',
    'Products',
    'Stores',
    'WarehouseRequests',
    'Brands',
    'Statistics',
    'Categories',
    'Warehouses',
  ],
  endpoints: builder => ({
    getAllOrders: builder.query({
      query: ({ page = 1, statuses, storeIds, startDate, endDate }) => ({
        url: '/orders/all',
        params: { page, statuses, storeIds, startDate, endDate },
      }),
      providesTags: ['Orders'],
    }),
    createOrder: builder.mutation({
      query: data => ({ url: '/orders', method: 'POST', body: data }),
      invalidatesTags: ['Orders'],
    }),
    processOrder: builder.mutation({
      query: data => ({ url: '/orders/processing', method: 'PATCH', body: data }),
      invalidatesTags: ['Orders'],
    }),
    sendOrder: builder.mutation({
      query: data => ({ url: '/orders/send', method: 'PATCH', body: data }),
      invalidatesTags: ['Orders'],
    }),
    completeOrder: builder.mutation({
      query: orderId => ({ url: '/orders/complete', method: 'PATCH', body: { orderId } }),
      invalidatesTags: ['Orders'],
    }),
    login: builder.mutation({
      query: data => ({ url: '/auth/login', method: 'POST', body: data }),
    }),
    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    getMyOrders: builder.query({
      query: ({ page = 1, statuses, date }) => ({
        url: '/orders',
        params: { page, statuses, date },
      }),
      providesTags: ['Orders'],
    }),
    getOrderById: builder.query({
      query: id => ({ url: `/orders/${id}` }),
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
      query: data => ({ url: `/product/${data.id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Products'],
    }),
    addProduct: builder.mutation({
      query: data => ({ url: '/product', method: 'POST', body: data }),
      invalidatesTags: ['Products'],
    }),
    deleteProduct: builder.mutation({
      query: id => ({ url: '/product', method: 'DELETE', body: id }),
      invalidatesTags: ['Products'],
    }),
    increaseProduct: builder.mutation({
      query: data => ({
        url: '/warehouse/increase',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    decreaseProduct: builder.mutation({
      query: data => ({
        url: '/warehouse/decrease',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    getAllUsers: builder.query({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    createUser: builder.mutation({
      query: data => ({ url: '/users', method: 'POST', body: data }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: id => ({ url: '/users', method: 'DELETE', body: { id } }),
      invalidatesTags: ['Users'],
    }),
    resetUserPassword: builder.mutation({
      query: ({ id, password }) => ({
        url: '/auth/restore',
        method: 'POST',
        body: { userId: id, password },
      }),
      invalidatesTags: ['Users'],
    }),
    getAllStores: builder.query({
      query: () => '/stores',
      providesTags: ['Stores'],
    }),
    createStore: builder.mutation({
      query: data => ({ url: '/stores', method: 'POST', body: data }),
      invalidatesTags: ['Stores'],
    }),
    updateStore: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/stores/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Stores', 'Products'],
    }),
    deleteStore: builder.mutation({
      query: id => ({ url: `/stores/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Stores'],
    }),
    getWarehouseRequests: builder.query({
      query: ({ status, startDate, endDate } = {}) => ({
        url: '/warehouse/requests',
        params: { status, startDate, endDate },
      }),
      providesTags: ['WarehouseRequests'],
    }),
    getAdminWarehouseRequests: builder.query({
      query: ({ status, startDate, endDate } = {}) => ({
        url: '/warehouse/orders',
        params: { status, startDate, endDate },
      }),
      providesTags: ['WarehouseRequests'],
    }),
    createWarehouseRequest: builder.mutation({
      query: data => ({ url: '/warehouse', method: 'POST', body: data }),
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
    updateWarehouseRequestItems: builder.mutation({
      query: ({ id, items }) => ({
        url: `/warehouse/${id}/items`,
        method: 'PATCH',
        body: { items },
      }),
      invalidatesTags: ['WarehouseRequests'],
    }),
    getAllBrands: builder.query({
      query: () => '/brands',
      providesTags: ['Brands'],
    }),
    createBrand: builder.mutation({
      query: name => ({ url: '/brands', method: 'POST', body: { name } }),
      invalidatesTags: ['Brands'],
    }),
    deleteBrand: builder.mutation({
      query: name => ({ url: '/brands', method: 'DELETE', body: { name } }),
      invalidatesTags: ['Brands'],
    }),
    updateBrand: builder.mutation({
      query: ({ id, name }) => ({
        url: `/brands/${id}`,
        method: 'PATCH',
        body: { name },
      }),
      invalidatesTags: ['Brands'],
    }),
    getStatisticsData: builder.query({
      query: ({ startDate, endDate, productId, storeId }) => {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (productId) params.productId = productId;
        if (storeId) params.storeId = storeId;

        return {
          url: '/statistics/data',
          params,
        };
      },
      providesTags: ['Statistics', 'Orders'],
    }),
    exportExcel: builder.mutation({
      query: ({ startDate, endDate, productId, storeId }) => {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (productId) params.productId = productId;
        if (storeId) params.storeId = storeId;

        return {
          url: '/statistics/export',
          params,
          responseHandler: response => response.blob(),
        };
      },
    }),
    getRequestsStatisticsData: builder.query({
      query: ({ startDate, endDate, productId, category }) => {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (productId) params.productId = productId;
        if (category) params.category = category;

        return {
          url: '/statistics/requests-data',
          params,
        };
      },
      providesTags: ['Statistics', 'WarehouseRequests'],
    }),
    exportRequestsExcel: builder.mutation({
      query: ({ startDate, endDate, productId, category }) => {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (productId) params.productId = productId;
        if (category) params.category = category;

        return {
          url: '/statistics/requests-export',
          params,
          responseHandler: response => response.blob(),
        };
      },
    }),
    getAllCategories: builder.query({
      query: () => '/category',
      providesTags: ['Categories'],
    }),
    createCategory: builder.mutation({
      query: data => ({ url: '/category', method: 'POST', body: data }),
      invalidatesTags: ['Categories'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, name }) => ({
        url: `/category/${id}`,
        method: 'PATCH',
        body: { name },
      }),
      invalidatesTags: ['Categories'],
    }),
    reorderCategories: builder.mutation({
      query: ids => ({ url: '/category/reorder', method: 'PATCH', body: { ids } }),
      invalidatesTags: ['Categories'],
    }),
    reorderProducts: builder.mutation({
      query: ids => ({ url: '/product/reorder', method: 'PATCH', body: { ids } }),
      invalidatesTags: ['Products'],
    }),
    getMe: builder.query({
      query: () => '/auth/me',
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),
    getLowStockProducts: builder.query({
      query: (threshold = 20) => ({
        url: '/product/low-stock',
        params: { threshold },
      }),
      providesTags: ['Products'],
    }),
    updateLanguage: builder.mutation({
      query: language => ({ url: '/auth/me/language', method: 'PATCH', body: { language } }),
    }),
    getAllWarehouses: builder.query({
      query: () => '/warehouses',
      providesTags: ['Warehouses'],
    }),
    createWarehouse: builder.mutation({
      query: data => ({ url: '/warehouses', method: 'POST', body: data }),
      invalidatesTags: ['Warehouses'],
    }),
    updateWarehouse: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/warehouses/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Warehouses', 'Products', 'WarehouseRequests'],
    }),
    deleteWarehouse: builder.mutation({
      query: id => ({ url: `/warehouses/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Warehouses', 'Products', 'WarehouseRequests'],
    }),
    uploadProductImage: builder.mutation({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append('image', file);
        return { url: `/product/${id}/image`, method: 'POST', body: formData };
      },
      invalidatesTags: ['Products'],
    }),
    deleteProductImage: builder.mutation({
      query: id => ({ url: `/product/${id}/image`, method: 'DELETE' }),
      invalidatesTags: ['Products'],
    }),
    getProductMonthlyOrdered: builder.query({
      query: id => `/product/${id}/monthly-ordered`,
      providesTags: ['Orders', 'Products'],
    }),
    deleteCategory: builder.mutation({
      query: id => ({ url: `/category/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Categories', 'Products'],
    }),
    deleteOrder: builder.mutation({
      query: id => ({ url: `/orders/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Orders', 'Statistics'],
    }),
    deleteWarehouseRequest: builder.mutation({
      query: id => ({ url: `/warehouse/${id}`, method: 'DELETE' }),
      invalidatesTags: ['WarehouseRequests', 'Statistics'],
    }),
    getWarehouseStocks: builder.query({
      query: id => `/warehouses/${id}/stocks`,
      providesTags: ['Warehouses', 'Products'],
    }),
    setProductStock: builder.mutation({
      query: data => ({ url: '/warehouse/set', method: 'PATCH', body: data }),
      invalidatesTags: ['Products', 'Warehouses'],
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
  useUpdateStoreMutation,
  useDeleteStoreMutation,
  useCreateOrderMutation,
  useProcessOrderMutation,
  useSendOrderMutation,
  useCompleteOrderMutation,
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
  useUpdateBrandMutation,
  useGetStatisticsDataQuery,
  useExportExcelMutation,
  useGetRequestsStatisticsDataQuery,
  useExportRequestsExcelMutation,
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useUpdateWarehouseRequestItemsMutation,
  useDecreaseProductMutation,
  useIncreaseProductMutation,
  useGetMeQuery,
  useUpdateUserMutation,
  useGetLowStockProductsQuery,
  useLazyGetLowStockProductsQuery,
  useReorderCategoriesMutation,
  useReorderProductsMutation,
  useUpdateLanguageMutation,
  useGetAllWarehousesQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
  useUploadProductImageMutation,
  useDeleteProductImageMutation,
  useGetProductMonthlyOrderedQuery,
  useDeleteCategoryMutation,
  useDeleteOrderMutation,
  useDeleteWarehouseRequestMutation,
  useGetWarehouseStocksQuery,
  useSetProductStockMutation,
} = api;
