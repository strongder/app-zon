import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import HomeStack from "../navigation/HomeStack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NotificationScreen from "../screens/NotificationScreen";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../redux/CartSlice";
import {
  fetchNotifications,
  fetchUnreadNotifications,
} from "../redux/NotiffiSlice";
import useSocket from "../hook/useSocket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SupportScreen from "../screens/SupportScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";

const BottomTabs = () => {
  const Tab = createBottomTabNavigator();
  const dispatch = useDispatch();
  const [unreadCount, setUnreadCount] = useState<any>(0);
  const currentUser = useSelector((state: any) => state.users.currentUser);
  const listNotification = useSelector(
    (state: any) => state.notifications.notifications
  );
  const unreadCountOld = useSelector(
    (state: any) => state.notifications.unreadCount
  );

  const { cart } = useSelector((state: any) => state.carts);
  const [notifications, setNotifications] = useState<any>([]);
  const token = AsyncStorage.getItem("token") + "";

  useEffect(() => {
    setUnreadCount(unreadCountOld);
  }, [unreadCountOld]);
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchCart());
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchNotifications());
    }
  }, [currentUser]);
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchNotifications());
      dispatch(fetchUnreadNotifications());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (listNotification) {
      setNotifications(listNotification);
    }
  }, [listNotification]);

  const handleNotification = (data: any) => {
    setUnreadCount((prev: any) => prev + 1);
    setNotifications((prev: any) => [data, ...prev]);
  };
  const readNotification = () => {
    setUnreadCount((prev: any) => (prev - 1 > 0 ? prev - 1 : 0));
  };
  const connected = useSocket(
    `/user/${currentUser?.id}/queue/notify`,
    token,
    handleNotification
  );
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="person" size={24} color="red" />
            ) : (
              <Ionicons name="person-outline" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Notification"
        options={{
          headerShown: true,
          title: "Thông báo", // Đặt tiêu đề rõ ràng cho giỏ hàng
          headerTitleAlign: "center", // Căn giữa tiêu đề
          headerTitleStyle: {
            color: "black",
            fontSize: 22,
            fontWeight: "bold",
          },
          headerStyle: {
            backgroundColor: "white",
            borderBottomWidth: 1,
          },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="notifications" size={24} color="red" />
            ) : (
              <Ionicons name="notifications-outline" size={24} color="black" />
            ),
          tabBarBadge: unreadCount > 0 ? unreadCount : null,
        }}
        children={() => (
          <NotificationScreen
            notifications={notifications}
            setUnreadCount={readNotification}
          />
        )}
      />
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: true,
          title: "SHOP", 
          headerTitleStyle: {
            color: "blue", // Màu tiêu đề để nổi bật
            fontSize: 22, // Tăng kích cỡ tiêu đề
            // fontFamily: 
          },
          
          headerTitleAlign: "center",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="home" size={24} color="red" />
            ) : (
              <AntDesign name="home" size={24} color="black" />
            ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerShown: true,
          title: "Giỏ hàng", // Đặt tiêu đề rõ ràng cho giỏ hàng
          headerTitleAlign: "center", // Căn giữa tiêu đề
          headerTitleStyle: {
            color: "black", // Màu tiêu đề để nổi bật
            fontSize: 22, // Tăng kích cỡ tiêu đề
            fontWeight: "bold", // In đậm tiêu đề
          },
          headerStyle: {
            backgroundColor: "white",
            borderBottomWidth: 1,
          },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <AntDesign name="shoppingcart" size={24} color="red" />
            ) : (
              <AntDesign name="shoppingcart" size={24} color="black" />
            ),
          tabBarBadge:
            cart && cart.cartDetails?.length > 0
              ? cart.cartDetails.length
              : null,
        }}
      />

      <Tab.Screen
        name="Support"
        component={SupportScreen}
        options={{
          headerShown: true,
          title: "Hỗ trợ", // Đặt tiêu đề rõ ràng cho giỏ hàng
          headerTitleAlign: "center", // Căn giữa tiêu đề
          headerTitleStyle: {
            color: "black", // Màu tiêu đề để nổi bật
            fontSize: 22, // Tăng kích cỡ tiêu đề
            fontWeight: "bold", // In đậm tiêu đề
          },
          headerStyle: {
            backgroundColor: "white",
            borderBottomWidth: 1,
          },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialIcons name="contact-support" size={24} color="red" />
            ) : (
              <MaterialIcons name="contact-support" size={24} color="black" />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({});
