// src/utils/axiosInstance.ts

import axios from "axios";
import { removeUserToken, setUserToken } from "../features/auth/authSlice";
import { RootState, store } from "../app/store";

export const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

const nonProtectedEndpoints = [
    '/login',
    '/public-endpoint1',
    '/another-non-protected-route'
  ];

// Unauthenticated Axios instance (for login)
// This is not mandatory as we have handledd this in axios request interceptor by checking the URL contains non protected endpoints, check below commented code inside request interceptor
export const unauthenticatedAxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Do not include anything from the store.ts directly in axiosInstance otherwise the Circular Dependency error will come. Because axiosInstace.ts will be compiled before the store is instantiated.
// Steps to Solve this Problem:
// Step 1: Move Axios Instance Configuration to a Separate File
// Separate any logic that depends on the store state out of the axiosInstance configuration file. Instead of directly importing the store, you can get the token from a function argument or set up interceptors dynamically after store initialization.

// axiosInstance.ts (without direct store dependency):

export const setupInterceptors = (
  getAccessToken: () => string | null,
  getRefreshToken: () => string | null,
  updateAccessToken: (newAccessToken: {
    access_token: string;
    refresh_token: string;
  }) => void,
  removeAccessToken: () => void
) => {
  axiosInstance.interceptors.request.use((config) => {         //The config parameter represents the configuration for the request being intercepted, which includes headers, method, URL, etc.
    // const state: RootState = store.getState();
    // const token = state.auth.access_token;

    const token = getAccessToken();

    console.log("Access Token Inside Axios Instance --- ", token);

    //The config.headers check is a safety measure to avoid runtime errors. While in most cases, config.headers will be present, this check handles cases where it may not be, which could potentially happen if the request configuration is altered in a way that removes the headers property.
    // So if we don't want to set the token for unprotected routes or endpoints like /login we can alter the config.headers
    // To bypass passing authorization headers for non-protected endpoints, you can modify your axios instance by adding a condition to the request interceptor. This condition can check if the request URL matches a non-protected endpoint and, if so, skip adding the Authorization header.

    // Here's how to do it:
    // List Non-Protected Endpoints: Create an array of non-protected endpoint paths.
    // Update the Interceptor: In the interceptor, check if the request URL is in the non-protected list and only add the header if it’s a protected route.
      
    console.log("URL",config.url);
    
    if (token && config.headers && config.url && !nonProtectedEndpoints.includes(config.url)) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    console.log("CONGIF", config);

    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          //   const state: RootState = store.getState();
          //   const refreshToken = state.auth.refresh_token;

          const refreshToken = getRefreshToken();

          const { data } = await axios.post("http://127.0.0.1:8000/refresh", {
            token: refreshToken,
          });

          //   store.dispatch(
          //     setUserToken({
          //       access_token: data.accessToken,
          //       refresh_token: data.refreshToken,
          //     })
          //   );

          updateAccessToken({
            access_token: data.accessToken,
            refresh_token: data.refreshToken,
          });

          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${data.accessToken}`;

          return axiosInstance(originalRequest); // Retry the original request with the new access token
        } catch (refreshError) {
          //   store.dispatch(removeUserToken());
          removeAccessToken();
          window.location.href = "/login"; // Redirect to login on failure to refresh
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
