import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import OrderItem from "../components/OrderItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderByUser } from "../redux/OrderSlice";

const OrderHistoryScreen = ({ navigation }: any) => {
  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const dispatch = useDispatch();
  const orders = useSelector((state: any) => state.orders.listOrderByUser);
  const currentUser = useSelector((state: any) => state.users.currentUser);

  console.log("listOrder", orders);
  // Fetch orders by user
  useEffect(() => {
    console.log(currentUser.id);
    if (currentUser.id) {
      dispatch(fetchOrderByUser(currentUser.id));
    }
  }, [dispatch, currentUser]);

  // Filter orders based on the selected status
  const filteredOrders = orders?.filter((order: any) => order?.status === selectedStatus) || [];

  return (
    <View style={styles.container}>
      {/* Filter Status Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.topbar}>
        {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"].map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setSelectedStatus(status)}
            style={styles.topbarItem}
          >
            <Text
              style={selectedStatus === status ? styles.activeText : styles.inactiveText}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      </ScrollView>

      {/* Order List */}
      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={({ item }: any) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("OrderDetail", { orderId: item.id })}
            >
              <OrderItem item={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item: any) => item.id.toString()}
        />
      ) : (
        <Text style={styles.noOrdersText}>No orders found for the selected status.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    padding: 16,
    paddingBottom: 60,
  },
  topbar: {
    flexDirection: "row",
    paddingBottom: 10,
  },
  topbarItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  activeText: {
    fontWeight: "bold",
    color: "blue",
  },
  inactiveText: {
    color: "black",
  },
  noOrdersText: {
    marginTop: 20,
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
});

export default OrderHistoryScreen;
