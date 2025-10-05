import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

const axiosClient = axios.create({
  baseURL: API_URL, // deployed backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("Error fetching token:", err);
  }
  return config;
});

export default axiosClient;
