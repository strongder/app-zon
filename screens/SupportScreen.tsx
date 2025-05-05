import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  ScrollView,
  Linking,
  Pressable,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const SupportScreen = () => {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);


  // Địa chỉ và vị trí cửa hàng
  const storeInfo = {
    name: "Clothes Store", // Tên cửa hàng
    address: "Số 141 - Chiến Thắng - Văn Quán - Hà Đông - Hà Nội", // Địa chỉ cửa hàng
    phone: "039 231 3572",
    email: "hieuhua7802@gmail.com",
    latitude: 20.968688,
    longitude: 105.773500, 
  };

  // Hàm mở Google Maps chỉ đường đến cửa hàng
  const openMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${storeInfo.latitude},${storeInfo.longitude}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>Thông tin cửa hàng</Text>
        <Text style={styles.text}>{storeInfo.name}</Text>
        <Text style={styles.text}>Địa chỉ: {storeInfo.address}</Text>
        <Text style={styles.text}>Điện thoại: {storeInfo.phone}</Text>
        <Text style={styles.text}>Email : {storeInfo.email}</Text>
      </View>
      <View style={styles.paymentMethodsContainer}>
        <Text style={styles.paymentMethodTitle}>Hình thức thanh toán</Text>
        <Text style={styles.paymentMethodText}>
          Thanh toán online thông qua Vnpay
        </Text>
        <Text style={styles.paymentMethodText}>
          Thanh toán khi nhận hàng(COD)
        </Text>
      </View>

      <View style={styles.mapContainer}>
        <Text style={styles.title}>Địa chỉ</Text>
        {errorMsg ? (
          <Text>{errorMsg}</Text>
        ) : (
          <Pressable onLongPress={openMaps}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: storeInfo.latitude,
                longitude: storeInfo.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: storeInfo.latitude,
                  longitude: storeInfo.longitude,
                }}
                title={storeInfo.name}
                description={storeInfo.address}
              />
            </MapView>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4", // Màu nền nhẹ để dễ nhìn
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  infoContainer: {
    backgroundColor: "#fff", // Màu trắng cho khu vực thông tin
    padding: 20,
    borderRadius: 10,
    // shadowColor: "#000", // Hiệu ứng đổ bóng
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 5,
    marginBottom: 20, // Khoảng cách dưới giữa các thành phần
  },

  text: {
    fontSize: 16, // Kích cỡ chữ vừa
    color: "#555", // Màu chữ dễ đọc
    marginBottom: 5,
  },
  mapContainer: {
    height: 250, // Chiều cao của container chứa bản đồ
    backgroundColor: "#fff", // Nền trắng để đồng bộ với các phần khác
    paddingTop: 20,
    borderRadius: 10, // Bo góc cho bản đồ
    // overflow: "hidden", // Đảm bảo góc bo tròn
    // shadowColor: "#000", // Đổ bóng để tạo chiều sâu
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2, // Giảm opacity để đổ bóng nhẹ hơn
    // shadowRadius: 5,
    // elevation: 5, // Đổ bóng cho Android
  },
  map: {
    width: "100%", // Chiều rộng toàn phần của container
    height: "100%", // Chiều cao toàn phần của container
  },
  title: {
    fontSize: 20, // Tăng kích cỡ tiêu đề
    fontWeight: "bold",
    color: "#333", // Màu chữ dễ nhìn
    marginBottom: 10, // Khoảng cách dưới tiêu đề với nội dung bản đồ
    textAlign: "center", // Canh giữa tiêu đề
  },
  paymentMethodsContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 5,
    marginBottom: 20,
  },
  paymentMethodTitle: {
    fontSize: 18,
    fontWeight: "bold",
    margin: "auto",

    marginBottom: 10,
    color: "#333",
  },
  paymentMethodText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
});
export default SupportScreen;
