import React, { useContext, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function CartScreen({ navigation }: any) {
  const { user } = useContext(AuthContext);
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (!user) {
      navigation.replace("Login"); // force login if guest
    }
  }, [user]);

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {cart.length === 0 ? (
        <Text>Cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text>
                  {item.name} x {item.quantity}
                </Text>
                <Text>${(item.price * item.quantity).toFixed(2)}</Text>
                <Button
                  title="Remove"
                  onPress={() => removeFromCart(item.id)}
                />
              </View>
            )}
          />
          <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
          <Button title="Clear Cart" onPress={clearCart} />
          <Button
            title="Checkout (mock)"
            onPress={() => {
              clearCart();
              alert("Order placed!");
            }}
          />
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
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
  },
  total: { fontSize: 18, fontWeight: "bold", marginVertical: 12 },
});
