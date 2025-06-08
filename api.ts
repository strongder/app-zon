import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";
// export const IP = " 192.168.204.1"
export const IP= "192.168.1.50"
export const API_URL = `http://${IP}:8080/api/v1`;
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const configAxios = (navigation: any) => {
  // Interceptor cho request
  axiosInstance.interceptors.request.use(
    async (config) => {
      const noAuthRequiredUrls = ["/login", "/register", "/public"];
      const isNoAuthRequired = noAuthRequiredUrls.some((url) =>
        config.url?.includes(url)
      );

      if (!isNoAuthRequired) {
        const token = await AsyncStorage.getItem("token");

        // Kiểm tra token hợp lệ
        if (token && token !== "undefined" && token.trim() !== "") {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // Nếu không có token, điều hướng về Login
          Alert.alert("Phiên đăng nhập đã hết", "Vui lòng đăng nhập lại.");
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
          return Promise.reject("No token found or invalid.");
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;

      // Nếu token hết hạn hoặc không hợp lệ
      if (status === 401 || status === 403) {
        await AsyncStorage.removeItem("token");
        Alert.alert("Phiên đăng nhập đã hết", "Vui lòng đăng nhập lại.");
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }

      return Promise.reject(error);
    }
  );
};
export default axiosInstance;
