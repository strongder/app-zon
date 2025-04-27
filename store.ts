import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./redux/UserSlice";
import authReducer from "./redux/AuthSlice";
import cartReducer from "./redux/CartSlice";
import productReducer from "./redux/ProductSlice";
import categoryReducer from "./redux/CategorySlice";
import notificationReducer from "./redux/NotiffiSlice";
import reviewReducer from "./redux/ReviewSlice";
import orderReducer from "./redux/OrderSlice";
import paymentReducer from "./redux/PaymentSlice";
import voucherReducer from "./redux/VoucherSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";


const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["currentUser"],
} 
const persistedReducer = persistReducer(persistConfig, userReducer);


export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: persistedReducer,
    carts: cartReducer,
    products: productReducer,
    categories: categoryReducer,
    notifications: notificationReducer,
    reviews: reviewReducer,
    orders: orderReducer,
    payments: paymentReducer,
    vouchers: voucherReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt kiểm tra tính tuần tự hóa
    })

});
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
