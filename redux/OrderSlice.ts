import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api";

export const fetchOrderById: any = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId) => {
    try {
      const response = await axiosInstance.get(`/orders/${orderId}`);
      return response.data.result;
    } catch (error) {
      console.error("Get order fail:", error);
      throw error; // Ném lỗi để có thể xử lý trong component
    }
  }
);

export const fetchOrderByUser: any = createAsyncThunk(
  "orders/fetchOrderByUser",
  async () => {
    try {
      const response = await axiosInstance.get(`/orders/users`);
      return response.data.data;
    } catch (error) {
      console.error("Get orders fail:", error);
      throw error; // Ném lỗi để có thể xử lý trong component
    }
  }
);

export const placeOrder: any = createAsyncThunk(
  "orders/placeOrder",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/orders`, data);
      return response.data.data;
    } catch (error: any) {
      // 👇 Log chi tiết lỗi từ backend
      if (error.response) {
        console.error("Create order fail:", error.response.data);
        return rejectWithValue(error.response.data);
      } else {
        console.error("Unexpected error:", error.message);
        return rejectWithValue({ message: "Unknown error occurred" });
      }
    }
  }
);


export const cancelOrder: any = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId) => {
    try {
      const response = await axiosInstance.put(
        `/orders/cancel-order/${orderId}`
      );
      return response.data.result;
    } catch (error) {
      console.error("Cancel order fail:", error);
      throw error; // Ném lỗi để có thể xử lý trong component
    }
  }
);

export const completeOrder: any = createAsyncThunk(
  "orders/completeOrder",
  async (orderId) => {
    try {
      const response = await axiosInstance.put(
        `/orders/complete-order/${orderId}`
      );
      return response.data.result;
    } catch (error) {
      console.error("Complete order fail:", error);
      throw error; // Ném lỗi để có thể xử lý trong component
    }
  }
);

export const updatePaymentMethod: any = createAsyncThunk(
  "orders/updatePaymentMethod",
  async (param: { orderId: string; paymentMethod: string }) => {
    console.log("param", param);
    try {
      const response = await axiosInstance.put(
        `/orders/update-payment-method`,
        null,
        { params: param } // Đưa param vào đây để gửi qua query parameters
      );
      return response.data.result;
    } catch (error) {
      console.error("Update payment method failed:", error);
      throw error;
    }
  }
);


const initialState: any = {
  listOrderByUser: [],
  order: {},
  loading: "idle",
  error: null, // Thêm state để lưu thông báo lỗi
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = "pending";
        state.error = null; // Reset error khi bắt đầu fetch
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.order = action.payload;
        state.loading = "succeeded";
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = "idle";
        state.error = action.error.message; // Lưu thông báo lỗi
      })
      .addCase(fetchOrderByUser.fulfilled, (state, action) => {
        state.listOrderByUser = action.payload;
        state.loading = "succeeded";
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.listOrderByUser.push(action.payload);
        state.loading = "succeeded";
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.order = action.payload;
        state.listOrderByUser = state.listOrderByUser.map((order: any) => {
          return order.id === action.payload.id ? action.payload : order;
        });
      })
      .addCase(completeOrder.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.listOrderByUser = state.listOrderByUser.map((order: any) => {
          return order.id === action.payload.id ? action.payload : order;
        });
      })
      .addCase(updatePaymentMethod.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.order = action.payload;
        state.listOrderByUser = state.listOrderByUser.map((order: any) => {
          return order.id === action.payload.id ? action.payload : order;
        });
        });
  },
});

export default orderSlice.reducer;
