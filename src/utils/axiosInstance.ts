// src/utils/axiosInstance.ts

import axios from "axios";
import { removeUserToken, setUserToken } from "../features/auth/authSlice";
import { RootState, store } from "../app/store";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Unauthenticated Axios instance (for login)
export const unauthenticatedAxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
});


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
  axiosInstance.interceptors.request.use((config) => {
    // const state: RootState = store.getState();
    // const token = state.auth.access_token;

    const token = getAccessToken();

    console.log("Access Token Inside Axios Instance --- ", token);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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
