import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api";
import { configAxios } from "../api";

export const fetchProductById: any = createAsyncThunk(
  "products/fetchProductById",
  async (productId: number) => {
    try {
      const response = await axiosInstance.get(`/products/${productId}`);
      return response.data.data;
    } catch (error) {
      console.log("Get product fail:", error);
    }
  }
);
export const fetchProduct: any = createAsyncThunk(
  "products/fetchProduct",
  async ({param}: any) => {
    try {
      const response = await axiosInstance.get(
        `/public/products`,
        param ? { params: param } : {}
      );
      return response.data.result.content;
    } catch (error) {
      console.log("Get product fail:", error);
    }
  }
);
export const fetchProductByCategory: any = createAsyncThunk(
  "products/fetchProductByCategory",
  async (categoryId) => {
    try {
      const response = await axiosInstance.get(
        `/public/products/category/${categoryId}`
      );
      return response.data.result.content;
    } catch (error) {
      console.log("Get product fail:", error);
    }
  }
);
export const fetchProductBySearch: any = createAsyncThunk(
  "products/fetchProductBySearch",
  async ({ param }: any) => {
    try {
      const response = await axiosInstance.get(`/public/search`, {
        params: param,
      });
      return response.data.result.content;
    } catch (error: any) {
      console.log("search product failed:", error);
    }
  }
);

export const fetchProductByDiscount: any = createAsyncThunk(
  "products/fetchProductByDiscount",
  async ({ param }: any) => {
    try {
      const response = await axiosInstance.get(
        `/public/product-discount`,
        param ? { params: param } : {}
      );
      return response.data.result.content;
    } catch (error) {
      console.log("Get discount product fail:", error);
    }
  }
);

export const fetchProductBySearchExtend: any = createAsyncThunk(
  "products/productBySearchExtend",
  async ( data: any) => {
    try {
      const response = await axiosInstance.post(`/products/search`, data);
      return response.data.result;
    } catch (error: any) {
      console.log("search product failed:", error);
    }
  }
);

export const fetchSuggestedProducts: any = createAsyncThunk(
  "products/fetchSuggestedProducts",
  async () => {
    try {
      const response = await axiosInstance.get(
        `/kmeans`
      );
      console.log("Suggested Products Response:", JSON.stringify(response.data, null, 2));
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.log("Get suggested products fail:", error);
      return [];
    }
  }
);

export const fetchNewProducts: any = createAsyncThunk(
  "products/fetchNewProducts",
  async ({ param }: any) => {
    try {
      const response = await axiosInstance.get(
        `public/newproduct`,
        param ? { params: param } : {}
      );
      console.log("New Products Response:", JSON.stringify(response.data, null, 2));
            if (response.data && response.data.data) {
        return Array.isArray(response.data.data) ? response.data.data : [];
      }
      return [];
    } catch (error) {
      console.log("Get new products fail:", error);
      return [];
    }
  }
);

const initialState: any = {
  listProduct: [],
  listProductSearch: [],
  productSearchExtend: [],
  listProductByCategory: [],
  listDiscountProduct: [],
  suggestedProducts: [],
  newProducts: [],
  product: {},
  loading: "idle",
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.product = action.payload;
        state.loading = "succeeded";
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.listProduct = [...state.listProduct, ...action.payload];
        state.loading = "succeeded";
      })
      .addCase(fetchProductByCategory.fulfilled, (state, action) => {
        state.listProductByCategory = action.payload;
        state.loading = "succeeded";
      })
      .addCase(fetchProductBySearch.fulfilled, (state, action) => {
        state.listProductSearch = action.payload;
        state.loading = "succeeded";
      })
      .addCase(fetchProductByDiscount.fulfilled, (state, action) => {
        state.listDiscountProduct = action.payload;
        state.loading = "succeeded";
      })
      .addCase(fetchProductBySearchExtend.fulfilled, (state, action) => {
        state.productSearchExtend = action.payload;
        state.loading = "succeeded";
      })
      .addCase(fetchSuggestedProducts.fulfilled, (state, action) => {
        state.suggestedProducts = action.payload || [];
        state.loading = "succeeded";
      })
      .addCase(fetchNewProducts.fulfilled, (state, action) => {
        state.newProducts = action.payload;
        state.loading = "succeeded";
      });
  },
});
export default productSlice.reducer;
