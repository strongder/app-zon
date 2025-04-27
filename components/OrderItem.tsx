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
      <Text style={styles.status}>Trạng thái: {order?.status}</Text>
      <FlatList
        style={styles.list}
        data={order?.orderDetails}
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
                  {item?.productDetail?.color}
                </Text>
                <Text style={styles.quantity}>Số lượng: {item?.quantity}</Text>
                <Text style={styles.price}>
                  Đơn giá: {item?.productDetail?.price} VNĐ
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
                Tổng giá: {item?.productDetail?.price * item?.quantity} VNĐ
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
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  list: {
    width: "100%",
    gap: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  classification: {
    fontSize: 16,
    color: "#000",
  },
  quantity: {
    fontSize: 16,
    color: "#000",
  },
  price: {
    fontSize: 14,
    color: "#000",
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e91e63",
    marginTop: 10,
  },
  status: {
    fontSize: 15,
    color: "#4caf50",
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonAction: {
    backgroundColor: "orange",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonReview: {
    backgroundColor: "orange",
    width: "30%",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "flex-end",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default OrderItem;
