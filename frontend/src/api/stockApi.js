import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const stockApi = createApi({
    reducerPath: 'stockApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://www.alphavantage.co/',
    }),
    endpoints: (builder) => ({
        getStockDetails: builder.query({
            query: (ticker) => `query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${process.env.API_KEY}`,
        }),
    }),
})

export const { useGetStockDetailsQuery } = stockApi 
