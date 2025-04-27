import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axiosInstance, { configAxios } from "../api";
import useSocket from "../hook/useSocket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, readNotification } from "../redux/NotiffiSlice";
import NotifyItem from "../components/NotifyItem";
import { useNavigation } from "@react-navigation/native";
import { fetchCurrentUser } from "../redux/UserSlice";

const NotificationScreen = ({ notifications, setUnreadCount }: any) => {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  useEffect(() => {
    configAxios(navigation);
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  const handleReadNotification = async (item: any) => {
    if (item.type === "ORDER") {
      dispatch(readNotification(item.id));
      navigation.navigate("OrderDetail", { orderId: item.data });
    }
    setUnreadCount();
  };

  return (
    <View style={styles.container}>
      {notifications && (
        <FlatList
          data={notifications}
          keyExtractor={(item: any) => item?.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleReadNotification(item)}
              style={styles.notificationItem}
            >
              <NotifyItem notifyItem={item} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 0,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  notificationItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  notificationText: {
    fontSize: 16,
  },
});

export default NotificationScreen;
