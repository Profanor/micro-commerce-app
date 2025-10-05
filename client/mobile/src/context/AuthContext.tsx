import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import axiosClient from "../api/axiosClient";

interface User {
  email: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // load token on app start
  useEffect(() => {
    const loadUser = async () => {
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
    };
    loadUser();
  }, []);

  // login handler
  const login = async (email: string, password: string) => {
    try {
      const res = await axiosClient.post("/auth/login", {
        email,
        password,
      });

      const { accessToken, user: apiUser } = res.data;

      // save token securely
      if (!accessToken) throw new Error("No token returned from API");
      await SecureStore.setItemAsync("token", accessToken);

      // set user in state (fallback to email if API doesn't return a user)
      const safeUser = apiUser ?? { email };
      setUser(safeUser);
    } catch (err: any) {
      console.error("Login failed:", err.response?.data || err.message);
      throw new Error("Invalid email or password");
    }
  };

  // logout handler
  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
