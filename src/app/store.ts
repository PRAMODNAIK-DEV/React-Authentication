import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/api";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer, {
  removeUserToken,
  setUserToken,
} from "../features/auth/authSlice";
import { setupInterceptors } from "../utils/axiosInstance";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

//---------------------------------------------------IMPORTANT-----------------------------------------------------------
// This is very very important because, We should not directly use the states, data or reducers or anything direcly inside the axios interceptor because there will be a circular dependency.
//This error generally occurs due to a circular dependency in your imports. Here’s what might be happening:
// store.ts is importing authSlice, which itself or another file it depends on is importing the store again, resulting in a loop.
// The import order gets mixed up in a way that Webpack tries to access an uninitialized module, hence the Cannot access '__WEBPACK_DEFAULT_EXPORT__' before initialization error.
// Solution
// To resolve this, you can separate the store from the authSlice and axiosInstance configurations to remove the circular dependency.


// Step 2: Set Up Interceptors After Store Initialization
setupInterceptors(
  () => store.getState().auth.access_token,
  () => store.getState().auth.refresh_token,
  (newAccessToken: { access_token: string; refresh_token: string }) =>
    store.dispatch(setUserToken(newAccessToken)),
  () => store.dispatch(removeUserToken())
);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

setupListeners(store.dispatch);
