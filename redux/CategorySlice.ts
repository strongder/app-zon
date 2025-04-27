import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api";

export const fetchCategoryAll: any = createAsyncThunk(
  "categories/fetchCategory",
  async () => {
    try {
      const response = await axiosInstance.get(`/public/categories`);
      return response.data.result;
    } catch (error) {
      console.log("Get category fail:", error);
    }
  }
);

export const fetchProcedures: any = createAsyncThunk(
  "categories/fetchProcedures",
  async () => {
    try {
      const response = await axiosInstance.get(`/public/procedures`);
      return response.data.data;
    } catch (error) {
      console.log("Get category fail:", error);
    }
  }
);

const initialState = {
  categories: [],
  procedures: [],
  category: {},
  loading: "idle",
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryAll.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = "succeeded";
      })
      .addCase(fetchProcedures.fulfilled, (state, action) => {
        state.procedures = action.payload;
        state.loading = "succeeded";
      });
  },
});

export default categorySlice.reducer;
