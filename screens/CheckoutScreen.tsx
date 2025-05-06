import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../redux/OrderSlice";
import { fetchCart } from "../redux/CartSlice";
import { createPayment } from "../redux/PaymentSlice";

const CheckoutScreen = ({ navigation, route }: any) => {
  const { cartDetailIds, price, voucherId } = route.params;

  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [shippingMethod, setShippingMethod] = useState("FAST");
  const [total, setTotal] = useState<number>(price);
  const [shippingFee, setShippingFee] = useState<number>(0);

  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.users.currentUser);

  // Thông tin giao hàng
  const [fullName, setFullName] = useState(
    currentUser?.firstName + currentUser?.lastName
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState(currentUser?.address);
  const [note, setNote] = useState("");

  useEffect(() => {
    // Tính phí vận chuyển và tổng tiền
    const fee = shippingMethod === "FAST" ? 15000 : 50000;
    setShippingFee(fee);
    setTotal(price + fee);
  }, [shippingMethod, price]);

  const checkInfo = () => {
    if (phoneNumber === "" || fullName === "" || address === "") {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin giao hàng!");
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!checkInfo()) return;

    const data = {
      fullName: fullName,
      phone: phoneNumber,
      note: note,
      shippingAddress: address,
      shippingMethod: shippingMethod,
      paymentMethod: paymentMethod,
      cartDetailIds: cartDetailIds,
      price_total: total,
      voucherId: voucherId,
    };

    console.log(data);
    const action = await dispatch(placeOrder(data));
    if (placeOrder.fulfilled.match(action)) {
      const orderId = action.payload;
      if (paymentMethod === "CASH") {
        navigation.navigate("OrderHistory");
      } else if (paymentMethod === "CREDIT_CARD") {
        handleVnpayPayment(orderId);
      }
    }
    dispatch(fetchCart(currentUser.id));
  };

  const handleVnpayPayment = async (orderId: number) => {
    const param = {
      orderId: orderId,
      amount: total,
    };
    const payment = await dispatch(createPayment({ param })).unwrap();
    if (payment && payment.paymentUrl) {
      navigation.navigate("VnpayPayment", { paymentUrl: payment.paymentUrl });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
          <TextInput
            style={styles.input}
            placeholder="Họ tên"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Địa chỉ"
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            style={styles.input}
            placeholder="Ghi chú"
            value={note}
            onChangeText={setNote}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
          <Picker
            selectedValue={shippingMethod}
            onValueChange={(itemValue) => setShippingMethod(itemValue)}
          >
            <Picker.Item label="Vận chuyển nhanh" value="FAST" />
            <Picker.Item label="Hỏa tốc" value="EXPRESS" />
          </Picker>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <Picker
            selectedValue={paymentMethod}
            onValueChange={(itemValue) => setPaymentMethod(itemValue)}
          >
            <Picker.Item label="Thanh toán khi nhận hàng (COD)" value="CASH" />
            <Picker.Item label="Ví điện tử (VNPay)" value="CREDIT_CARD" />
          </Picker>
        </View>

        {/* Chi phí đơn hàng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi phí</Text>
          <Text style={styles.text}>
            Đơn hàng: {price.toLocaleString("vi-VN")} VNĐ
          </Text>
          <Text style={styles.text}>
           Vận chuyển: {shippingFee.toLocaleString("vi-VN")} VNĐ
          </Text>
        </View>
      </ScrollView>
      {/* Tổng cộng */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tổng cộng</Text>
        <Text style={styles.totalText}>
          {total.toLocaleString("vi-VN")} VNĐ
        </Text>
      </View>
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Xác nhận đặt hàng</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  scrollContainer: { paddingBottom: 80 },
  section: { marginBottom: 5 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  text: { fontSize: 16, paddingHorizontal: 20 },
  totalText: {
    fontSize: 20,
    color: "red",
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center", // Canh giữa văn bản
    paddingBottom: 10, // Thêm padding dưới nếu cần
  },

  checkoutButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },

  checkoutButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default CheckoutScreen;
