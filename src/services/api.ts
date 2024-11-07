import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { unauthenticatedAxiosInstance } from '../utils/axiosInstance';
// import {} from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'api',
    // baseQuery: fetchBaseQuery({
    //     baseUrl: "http://127.0.0.1:8000"
    // }),
    baseQuery: async ({ url, method, body }: { url: string; method: string; body?: any }) => {
        try {
          const response = await unauthenticatedAxiosInstance({
            url,
            method,
            data: body, // 'data' instead of 'body' as Axios uses 'data' for request payloads
          });
          return { data: response.data };
        } catch (error: any) {
          return { error: { status: error.response?.status, message: error.message || 'Request failed' } };
        }
      },
    endpoints: (builder) => ({

        loginUser: builder.mutation({

            query: (body: {username: string, password: string}) =>{
                return{
                    url: "/login",
                    method: "POST",
                    body,
                }
            }
        })
    })
})

export const {useLoginUserMutation} = authApi;