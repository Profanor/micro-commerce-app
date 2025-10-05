import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

// simple in-memory cache to avoid reading SecureStore on every request
let cachedToken: string | null = null;

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(async (config) => {
  try {
    if (!cachedToken) {
      cachedToken = await SecureStore.getItemAsync("token");
    }

    if (cachedToken) {
      config.headers.Authorization = `Bearer ${cachedToken}`;
    }

    console.log("Token in request:", cachedToken);
    console.log("Request headers:", config.headers);
  } catch (err) {
    console.error("Error fetching token:", err);
  }

  return config;
});

export default axiosClient;
