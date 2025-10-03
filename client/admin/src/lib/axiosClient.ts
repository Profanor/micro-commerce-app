import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:4001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token if present
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
