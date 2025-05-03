import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { completeOrder } from "../redux/OrderSlice";
import { useNavigation } from "@react-navigation/native";
import { getColorName } from "../utils/colorUtils";

const OrderItem = ({ item }: any) => {
  const order = item;
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const orderId = item.id;
  const handleCompleteOrder = () => {
    dispatch(completeOrder(orderId));
  };
  const handleReviews = (item: any) => {
    navigation.navigate("ProductReview", { orderItem: item });
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Mã đơn hàng: {order.id}</Text>
        <Text style={styles.status}>{order.status}</Text>
      </View>
      <FlatList
        data={order.orderDetails}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: any) => (
          <>
            <View style={{ flexDirection: "row", gap: 20 }}>
              <Image
                source={{ uri: item?.productDetail?.img }}
                style={styles.image}
              />
              <View>
                <Text style={styles.name}>{item?.productName}</Text>
                <Text style={styles.classification}>
                  Size: {item?.productDetail?.size} -{" "}
                  {getColorName(item?.productDetail?.color) || item?.productDetail?.color}
                </Text>
                <Text style={styles.quantity}>Số lượng: {item?.quantity}</Text>
                <Text style={styles.price}>
                  Đơn giá: {item?.productDetail?.price.toLocaleString('vi-VN')} VNĐ
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={[styles.totalPrice, { flex: 1 }]}>
                Tổng giá: {(item?.productDetail?.price * item?.quantity).toLocaleString('vi-VN')} VNĐ
              </Text>
              {order.status === "DELIVERED" && (
                <Pressable
                  style={styles.buttonReview}
                  onPress={() => handleReviews(item)}
                >
                  <Text style={styles.text}>Đánh giá</Text>
                </Pressable>
              )}
              {item.status === "SHIPPED" && (
                <Pressable
                  style={styles.buttonAction}
                  onPress={handleCompleteOrder}
                >
                  <Text style={styles.text}>Đã nhận hàng</Text>
                </Pressable>
              )}
            </View>
          </>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
  },
  status: {
    fontSize: 16,
    color: "#007AFF",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  classification: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: "#e91e63",
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e91e63",
  },
  buttonReview: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonAction: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
export default OrderItem;
