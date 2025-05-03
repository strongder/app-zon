import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
// export const IP = " 192.168.204.1"
export const IP= "192.168.1.242"
export const API_URL = `http://${IP}:8080/api/v1`;
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const configAxios = (navigation: any) => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const noAuthRequiredUrls = ["/public", "/login"];
      const isNoAuthRequired = noAuthRequiredUrls.some((url) =>
        config.url?.includes(url)
      );

      if (!isNoAuthRequired) {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // Immediately navigate to login if no token is found
          navigation.navigate("Login");
          // Reject the request since no token is available
          return Promise.reject("No token found, redirecting to login.");
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
