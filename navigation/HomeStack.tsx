import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import CategoryScreen from "../screens/CategoryScreen";
import SearchScreen from "../screens/SearchScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: "Chi tiết sản phẩm" }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Thanh toán" }} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: "Lịch sử đơn hàng" }} />
      <Stack.Screen name="Category" component={CategoryScreen} options={{ title: "Danh mục sản phẩm" }} />
      <Stack.Screen name="SearchPage" component={SearchScreen} options={{ title: "Tìm kiếm" }} />
    </Stack.Navigator>
  );
} 