import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, Order } from "../types/navigation";

type CartScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Cart"
>;

interface CartScreenProps {
  navigation: CartScreenNavigationProp;
}

export default function CartScreen({ navigation }: CartScreenProps) {
  const { user } = useContext(AuthContext);
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (!user) navigation.replace("Login");
  }, [user]);

  if (!user) return null;

  const handleCheckout = async () => {
    try {
      if (cart.length === 0) {
        Alert.alert("Cart Empty", "Add some items before checking out 🛒");
        return;
      }

      setLoading(true);
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const response = await axiosClient.post("/orders", { items });
      const order: Order = response.data;

      Alert.alert(
        "Order placed ✅",
        "Your order has been created successfully!"
      );
      clearCart();
      navigation.navigate("OrderSummary", { order });
    } catch (err) {
      console.error("Error placing order", err);
      Alert.alert("Error", "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      {cart.length === 0 ? (
        <Text style={styles.empty}>Your cart is empty 😢</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.placeholder}>
                    <Text style={{ color: "#999" }}>No Image</Text>
                  </View>
                )}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemPrice}>
                    ${item.price.toFixed(2)} x {item.quantity}
                  </Text>
                  <Button
                    title="Remove"
                    color="#cc0000"
                    onPress={() => removeFromCart(item.id)}
                  />
                </View>
              </View>
            )}
          />

          <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

          <View style={styles.actions}>
            <Button title="Clear Cart" onPress={clearCart} />
            <Button
              title={loading ? "Placing Order..." : "Checkout"}
              onPress={handleCheckout}
              disabled={loading}
            />
          </View>
        </>
      )}

      <Button
        title="Back to Home"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: "center" },
  empty: { textAlign: "center", fontSize: 16, color: "#666" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 10,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  itemPrice: { fontSize: 14, marginBottom: 6 },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
});
