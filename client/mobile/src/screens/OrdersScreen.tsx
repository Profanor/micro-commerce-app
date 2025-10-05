import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";

export default function OrdersScreen({ navigation }: any) {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axiosClient.get("/orders/my", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (loading) return <Text>Loading orders...</Text>;

  if (orders.length === 0)
    return <Text>No orders yet. Add something to your cart!</Text>;

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.orderItem}>
          <Text style={styles.title}>{item.product.title}</Text>
          <Text>Quantity: {item.quantity}</Text>
          <Text>Price: ${item.product.price.toFixed(2)}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  orderItem: { padding: 12, borderBottomWidth: 1, borderColor: "#eee" },
  title: { fontWeight: "bold" },
});
