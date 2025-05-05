import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen";
import SearchScreen from "../screens/SearchScreen";
import CategoryScreen from "../screens/CategoryScreen";
import VnPayScreen from "../screens/VnPayScreen";

import PaymentHistory from "../screens/PaymentHistory";
import BottomTabs from "../components/BottomTabs";
import PaymentResultScreen from "../screens/PaymentResultScreen";
import ProductReviewScreen from "../screens/ProductReviewScreen";
import EditProfileScreen from "../screens/EditProfileScreen";

const StackNaviagator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: "black",
            fontSize: 22,
            fontWeight: "bold",
          },
          headerStyle: {
            backgroundColor: "white"
          },
        }}
      >
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ title: "Thanh toán" }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ title: "Chi tiết sản phẩm" }}
        />
        <Stack.Screen
          name="OrderHistory"
          component={OrderHistoryScreen}
          options={{ title: "Lịch sử đơn hàng" }}
        />
        <Stack.Screen
          name="PaymentHistory"
          component={PaymentHistory}
          options={{ title: "Lịch sử thanh toán" }}
        />
        <Stack.Screen
          name="OrderDetail"
          component={OrderDetailScreen}
          options={{ title: "Chi tiết đơn hàng" }}
        />
        <Stack.Screen
          name="SearchPage"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          options={{ title: "Danh mục sản phẩm" }}
        />
        <Stack.Screen
          name="VnpayPayment"
          component={VnPayScreen}
          options={{ title: "Thanh toán vnpay" }}
        />
        <Stack.Screen
          name="PaymentResult"
          component={PaymentResultScreen}
          options={{ title: "Kết quả thanh toán" }}
        />
        <Stack.Screen
          name="ProductReview"
          component={ProductReviewScreen}
          options={{ title: "Đánh giá sản phẩm" }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ title: "Sửa thông tin" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNaviagator;

const styles = StyleSheet.create({});
