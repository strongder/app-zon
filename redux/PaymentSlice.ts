import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api";

export const fetchPayment: any = createAsyncThunk(
  "payments/fetchPayment",
  async (userId: number) => {
    try {
      const response = await axiosInstance.get(`/payments/user/${userId}`);
      return response.data.result;
    } catch (error) {
      console.log("Fetch payment fail:", error);
    }
  }
);
export const createPayment: any = createAsyncThunk(
  "payments/createPayment",
  async ({param}:any) => {
    try {
      console.log("----",param);
      const response = await axiosInstance.get("/payments/vn-pay", 
        { params: param }
      );
      console.log("Create payment success:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.log("Create payment fail:", error);
    }
  }
);

const initialState: any = {
  payments: [],
  payment: {},
  loading: "idle",
};

export const PaymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayment.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.payments = action.payload;
        state.loading = "successed";
      })
      .addCase(createPayment.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.payments = [...state.payments, action.payload]; 
        state.loading = "successed"; // Đánh dấu loading là "loaded"
    });
  },
});
export default PaymentSlice.reducer;