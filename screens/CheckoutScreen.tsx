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
  const { cartDetailIds, price, voucherId} = route.params;
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [total, setTotal] = useState<number>(price);
  const [shippingMethod, setShippingMethod] = useState("FAST");
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.users.currentUser);
  // Thông tin giao hàng
  const [fullName, setFullName] = useState(currentUser?.firstName + currentUser?.lastName);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState(currentUser?.address);
  const [note, setNote] = useState("");


  const checkInfo = () =>{
    if(phoneNumber === ""|| fullName === "" || address === ""){
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin giao hàng!");
      return false;
    }return true;
  }

  const handleCheckout = async () => {
    if (!checkInfo()) return;
    const data = {
      fullName: fullName,
      phone: phoneNumber,
      note:note,
      shippingAddress: address,
      shippingMethod: shippingMethod,
      paymentMethod: paymentMethod,
      cartDetailIds: cartDetailIds,
      price_total: 10005000,
      voucherId: voucherId,
    }; 
    
    console.log(data);
    const action = await dispatch(placeOrder( data ));
    if (placeOrder.fulfilled.match(action)) {
      const orderId = action.payload; // Assuming the orderId is in the payload
      if (paymentMethod === "CASH") {
        navigation.navigate("OrderHistory");
      } else if (paymentMethod === "CREDIT_CARD") {
        handleVnpayPayment(orderId); // Pass the orderId to the payment function
      }
    }
    dispatch(fetchCart(currentUser.id));
  };

  const handleVnpayPayment = async (orderId: number) => {
    const param = {
      orderId: orderId,
      amount : price
    }
    const payment = await dispatch(createPayment({ param })).unwrap();
    console.log(payment);
    if (payment && payment.paymentUrl) {
      console.log("----------------------")
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi phí</Text>
          <Text style={styles.text}>
            Đơn hàng: {total.toLocaleString("vi-VN")} VNĐ
          </Text>
          
        </View>
      </ScrollView>
      <Text style={styles.totalText}>
            Tổng cộng: {total.toLocaleString("vi-VN")} VNĐ
          </Text>
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
  text: { paddingHorizontal: 20 },
  totalText: {
    fontSize: 20,
    color: "red",
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",  // Canh giữa văn bản
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
