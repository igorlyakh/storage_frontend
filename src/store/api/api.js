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
  tagTypes: ['Users', 'Orders', 'Products'],
  endpoints: builder => ({
    getAllOrders: builder.query({
      query: () => '/orders/all',
      providesTags: ['Orders'],
    }),
  }),
});

export const { useGetAllOrdersQuery } = api;
