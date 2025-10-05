import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import axiosClient from "../api/axiosClient";
import { ActivityIndicator, View } from "react-native";

interface User {
  email: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          try {
            const res = await axiosClient.get("/auth/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);
          } catch (err) {
            console.warn("No /me endpoint or token invalid, fallback.");
            await SecureStore.deleteItemAsync("token");
          }
        }
      } catch (err) {
        console.error("Error loading token:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axiosClient.post("/auth/login", { email, password });
      const { accessToken, user: apiUser } = res.data;

      if (!accessToken) throw new Error("No token returned from API");

      await SecureStore.setItemAsync("token", accessToken);

      // optional: preload user info immediately
      setUser(apiUser ?? { email });
    } catch (err: any) {
      console.error("Login failed:", err.response?.data || err.message);
      throw new Error("Invalid email or password");
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    setUser(null);
  };

  // wait until auth is initialized before rendering app
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
