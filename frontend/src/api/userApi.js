import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/',
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        getCurrentUser: builder.query({
            query: () => "@me",
        }),
    }),
})

export const { useGetCurrentUserQuery } = userApi
