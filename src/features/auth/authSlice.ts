import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store"

export interface AuthState{
    access_token: string | null;
    refresh_token: string | null;
}

const initialState: AuthState = {
    access_token: null,
    refresh_token: null,
}

// This is a authThunk for Login




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
    }
})

export const selectAuth = (state: RootState) => state.auth;

export const {setUserToken, removeUserToken} = authSlice.actions;

export default authSlice.reducer;