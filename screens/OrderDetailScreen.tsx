import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelOrder,
  fetchOrderById,
  updatePaymentMethod,
} from "../redux/OrderSlice";
import { createPayment } from "../redux/PaymentSlice";
import { getColorName } from "../utils/colorUtils";
const OrderDetailScreen = ({ navigation, route }: any) => {
  const { orderId } = route.params;
  const dispatch = useDispatch();
  const [isChangingPayment, setIsChangingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const order = useSelector((state: any) => state.orders.order);

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
  }, [dispatch]);

  const handleCancelOrder = () => {
    const param = {
      id: orderId,
      status: "CANCELED", // đảm bảo đúng enum
      paymentStatus: order.paymentStatus,
    };
    dispatch(cancelOrder({ param }))
      .unwrap()
      .then(() => {
        alert("Đơn hàng đã được hủy thành công");
        navigation.navigate("OrderHistory"); // Điều hướng về
        // trang lịch sử đơn hàng sau khi hủy thành công
      })
      .catch((error: any) => {
        console.error("Failed to cancel order:", error);
        // Xử lý lỗi nếu cần
      });
  };

   const handlePaymentOrder = async (orderId: number) => {
      const param = {
        orderId: orderId,
        amount : order.totalAmount,
      }
      const payment = await dispatch(createPayment({ param })).unwrap();
      if (payment && payment.paymentUrl) {
        navigation.navigate("VnpayPayment", { paymentUrl: payment.paymentUrl });
      }
    };

  // Thay đổi phương thức thanh toán
  const handleChangePaymentMethod = async () => {
    const updatedPaymentData = {
      orderId,
      paymentMethod,
    };

    dispatch(updatePaymentMethod(updatedPaymentData));
    setIsChangingPayment(false);
  };


  return (
    <View
      style={isChangingPayment ? styles.containerOverlay : styles.container}
    >
      {order !== null && (
        <>
          <ScrollView style={styles.scrollContainer}>
            <Text style={styles.title}>Chi tiết đơn hàng</Text>
            <Text style={styles.text}>
              Phương thức thanh toán: {order?.paymentMethod}
            </Text>
            <Text style={styles.text}>Trạng thái: {order?.paymentStatus}</Text>
            <Text style={styles.text}>
              Tổng tiền: {order?.totalAmount?.toLocaleString()} VNĐ
            </Text>
            <Text style={styles.text}>
              Ngày tạo: {new Date(order?.createdAt)?.toLocaleString()}
            </Text>

            <Text style={styles.subtitle}>Địa chỉ giao hàng</Text>
            <Text style={styles.text}>Người nhận: {order?.fullName}</Text>
            <Text style={styles.text}>Điện thoại: {order?.phone}</Text>
            <Text style={styles.text}>Địa chỉ: {order?.shippingAddress}</Text>

            <Text style={styles.subtitle}>Sản phẩm</Text>
            {order?.orderDetails?.map((item: any) => (
              <View key={item.id} style={styles.productItem}>
                <Image
                  source={{ uri: item.productDetail.img }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.text}>Tên sản phẩm: {item.name}</Text>
                  <Text style={styles.text}>
                    Giá: {item?.price?.toLocaleString("vi-VI")} VNĐ
                  </Text>
                  <Text style={styles.text}>Số lượng: {item.quantity}</Text>
                  <Text style={styles.text}>
                    Phân loại: {item.productDetail.size} -{" "}
                    {getColorName(item.productDetail.color) || item.productDetail.color}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.actionsContainer}>
            {order?.status === "PENDING" && (
              <>
                <TouchableOpacity
                  style={styles.buttonAction}
                  onPress={handleCancelOrder}
                >
                  <Text style={styles.buttonText}>Hủy đơn hàng</Text>
                </TouchableOpacity>
              </>
            )}

            {order.paymentMethod === "CREDIT_CARD" &&
              order.status === "PENDING" && (
                <TouchableOpacity
                  style={styles.payment}
                  onPress={() => handlePaymentOrder(order.id)}
                >
                  <Text style={styles.buttonTextPayment}>Thanh toán ngay</Text>
                </TouchableOpacity>
              )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền mờ
  },
  scrollContainer: {
    padding: 16,
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 3,
    paddingHorizontal: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
  },
  productItem: {
    flexDirection: "row",
    marginBottom: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  productImage: {
    width: 90,
    height: 90,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  actionsContainer: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  buttonAction: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: "#3498db", // Màu xanh cho viền
    borderWidth: 2, // Độ dày của viền
    marginBottom: 10,
    borderRadius: 8, // Bo góc cho nút
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#3498db", // Màu nền cho nút được chọn
    borderColor: "#2980b9", // Màu viền cho nút được chọn
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },
  buttonTextPayment: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  changePayment: {
    position: "absolute",
    backgroundColor: "#fff",
    margin: "auto",
    padding: 16,
    top: "30%", // Đặt vị trí để modal không che khuất
    left: "10%",
    right: "10%",
    borderRadius: 8,
    elevation: 5, // Thêm độ nổi
    shadowColor: "#000", // Màu bóng
    shadowOffset: { width: 0, height: 2 }, // Độ rộng và chiều cao của bóng
    shadowOpacity: 0.3, // Độ trong suốt của bóng
    shadowRadius: 4, // Độ mịn của bóng
  },
  confirmButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    marginHorizontal: 0,
    marginTop: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  payment: {
    backgroundColor: "orange",
    paddingVertical: 10,
    marginHorizontal: 0,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrderDetailScreen;
