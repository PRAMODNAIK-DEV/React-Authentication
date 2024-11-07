import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store"
import axiosInstance from "../../utils/axiosInstance";

export interface AuthState{
    access_token: string | null;
    refresh_token: string | null;
    loading: boolean;
    error: string | null;
    data: string | null
}

const initialState: AuthState = {
    access_token: null,
    refresh_token: null,
    loading: false,
    error: null,
    data: null,
}

// This is a authThunk for Login

export const fetchProtectedData = createAsyncThunk(
    'data/fetchProtectedData',
    async ( _, {rejectWithValue}) => {
        try{
            const response = await axiosInstance.get("/protected");
            return response.data;
        }
        catch(error: any){
            return rejectWithValue(error.response?.data || 'Failed to fetch data');
        }
    }
)


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        setUserToken: (state, action: PayloadAction<{access_token: string; refresh_token: string}>) => {

            localStorage.setItem("user", JSON.stringify({access_token: action.payload.access_token, refresh_token: action.payload.refresh_token}));

            state.access_token = action.payload.access_token;
            state.refresh_token = action.payload.refresh_token;
        },

        removeUserToken: (state) => {
            localStorage.removeItem("user");
            state.access_token= null;
            state.refresh_token = null;
            
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchProtectedData.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchProtectedData.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
          })
          .addCase(fetchProtectedData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          });
      }, 
})

export const selectAuth = (state: RootState) => state.auth;

export const {setUserToken, removeUserToken} = authSlice.actions;

export default authSlice.reducer;