import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api";

export const getVoucherByUser: any = createAsyncThunk(
    "voucher/getVoucherByUser",
    async () => {
      try {
        const response = await axiosInstance.post('/vouchers/search', {
            role: 'USER',
        });
        return response.data.result;
      } catch (error) {
        console.log("Get voucher fail:", error);
      }
    }
  );

const initialState: any = {
  vouchers: [],
  loading: "idle",
};

const voucherSlice = createSlice({
  name: "vouchers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVoucherByUser.fulfilled, (state, action) => {   
            state.vouchers = action.payload;
            state.loading = "succeeded";
        })
  },
});

export default voucherSlice.reducer;
