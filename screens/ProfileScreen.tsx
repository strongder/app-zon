import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/AuthSlice";
import { fetchCurrentUser } from "../redux/UserSlice";
import { configAxios } from "../api";
import { AntDesign } from "@expo/vector-icons";

const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await dispatch(logout());
    console.log(AsyncStorage.getItem("token"));
    navigation.navigate("Login");
  };

  const currentUser = useSelector((state: any) => state.users.currentUser);

  useEffect(() => {
    configAxios(navigation);
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <ScrollView style={{}}>
        {currentUser && (
          <>
            <View style={styles.header}>
              <Image
                source={{ uri: currentUser?.avatar}}
                style={styles.avatar}
                
              />
              <Text style={styles.name}>{currentUser?.username}</Text>
              <Text style={styles.email}>{currentUser?.email}</Text>
            </View>
            <View style={styles.edit}>
              <AntDesign
                name="edit"
                size={28}
                color="black"
                onPress={() =>
                  navigation.navigate("EditProfile", {
                    currentUser: currentUser,
                  })
                }
              />
            </View>

            {/* Thông tin cá nhân */}
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoTitle}>Họ tên</Text>
                <Text style={styles.infoValue}>{currentUser?.firstName} {currentUser?.lastName}</Text>
              </View>
              {/* <View style={styles.infoRow}>
                <Text style={styles.infoTitle}>Phone</Text>
                <Text style={styles.infoValue}>{currentUser?.phone}</Text>
              </View> */}
            </View>
          </>
        )}
        
        <View style={styles.historySection}>
          <TouchableOpacity
            onPress={() => navigation.navigate("PaymentHistory")}
          >
            <Text style={styles.sectionTitle}>Lịch sử thanh toán</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.historySection}>
          <TouchableOpacity onPress={() => navigation.navigate("OrderHistory")}>
            <Text style={styles.sectionTitle}>Lịch sử đơn hàng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.buttonLogout}
        onPress={() => handleLogout()}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

// Thiết kế giao diện
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 15,
    paddingTop: 50,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#888",
  },
  infoContainer: {
    marginVertical: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoTitle: {
    fontSize: 16,
    color: "#333",
  },
  infoValue: {
    fontSize: 16,
    color: "#555",
  },
  historySection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  historyText: {
    fontSize: 16,
    color: "#555",
  },
  buttonLogout: {
    justifyContent: "flex-end",
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    // marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  edit:{
    position: "absolute",
    right: 0,
    top: 0,
  }
});

export default ProfileScreen;
