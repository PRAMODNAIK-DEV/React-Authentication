import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import {} from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000"
    }),
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