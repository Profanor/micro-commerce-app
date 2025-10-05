import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";

type OrderSummaryRouteProp = RouteProp<RootStackParamList, "OrderSummary">;
type OrderSummaryNavProp = NavigationProp<RootStackParamList, "OrderSummary">;

export default function OrderSummaryScreen() {
  const route = useRoute<OrderSummaryRouteProp>();
  const navigation = useNavigation<OrderSummaryNavProp>();
  const { order } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Successful 🎉</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Order ID</Text>
        <Text style={styles.value}>{order.id}</Text>

        <Text style={styles.label}>Total</Text>
        <Text style={styles.value}>
          ₦
          {Number(order.total).toLocaleString("en-NG", {
            minimumFractionDigits: 2,
          })}
        </Text>

        <Text style={styles.label}>Created At</Text>
        <Text style={styles.value}>
          {new Date(order.createdAt).toLocaleString()}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  card: {
    width: "100%",
    backgroundColor: "#f8f8f8",
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
