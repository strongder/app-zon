import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../api";

// First, create the thunk
interface LoginType {
    username: string;
    password: string;
    }
export const login: any = createAsyncThunk(
  "auth/login",
  async (authRequest: LoginType) => {
    try {
      const response = await axiosInstance.post(
        "/login",
        authRequest
      );
      const token = response.data.data.accessToken;
      await AsyncStorage.setItem("token", token);
      return response.data.data;
    } catch (error) {
      console.log("check",error);
    }
  }
);


interface AuthState {
    token: string | null;
    loading: string
}

const initialState: AuthState = {
  token: null,
  loading: "idle",
};

// Then, handle actions in your reducers:
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
        state.token = null;
        AsyncStorage.removeItem("token");
     },
  },
  extraReducers: (builder) => {
    builder
        .addCase(login.pending, (state) => {
            state.loading = "pending";
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = "succeeded";
            if (action.payload?.accessToken) {
                state.token = action.payload.accessToken;
                AsyncStorage.setItem("token", action.payload.accessToken);
            }
        })
  },
});

export const { logout }: any = authSlice.actions;
export default authSlice.reducer;
