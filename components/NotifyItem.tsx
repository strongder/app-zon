import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import axiosInstance from "../api";

const NotifyItem = ({ notifyItem }: any) => {
  const [order, setOrder] = useState<any>(null);

  // Fetch order details if notification type is 'ORDER'
  useEffect(() => {
    if (notifyItem?.type === "ORDER") {
      fetchOrderDetails(notifyItem?.data);
    }
  }, [notifyItem?.type]);

  // Function to fetch order details by ID
  const fetchOrderDetails = async (orderId: any) => {
    try {
      const response = await axiosInstance.get(`/orders/${orderId}`);
      setOrder(response.data.result);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };
  return (
    <View style={styles.container}>
      {order && (
        <View style={styles.notificationContainer}>
          {notifyItem?.type === "ORDER" && (
            <Image
              source={{ uri: order?.orderItems[0]?.image }}
              style={styles.image}
            />
          )}
          <View style={styles.textContainer}>
            <View style ={styles.title}>
              <Text style={styles.textTitle}>{notifyItem?.title}</Text>
              {!notifyItem.read && <Text style={styles.unreadText}>.</Text>}
            </View>
            <Text style={styles.message}>{notifyItem?.message}</Text>
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {},
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between", // Giãn cách phần title và unread text
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between", // Giãn cách phần title và unread text
  },
    textTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    color: "#555",
  },
  unreadText: {
    color: "red",
    position: "absolute",
    right: -10,
    top: -36,
    fontSize: 50, // Điều chỉnh kích thước để phù hợp
    fontWeight: "bold", // Dấu "." đậm hơn để nổi bật
  },
});

export default NotifyItem;
