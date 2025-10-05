import React, { useContext } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function ProductDetailScreen({ route, navigation }: any) {
  const { user } = useContext(AuthContext);
  const { product } = route.params;
  const { addToCart } = useContext(CartContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Button
        title="Add to Cart"
        onPress={() => {
          if (!user) {
            navigation.navigate("Login");
          } else {
            addToCart(product);
            Alert.alert("Success", "Item added to cart 🛒");
          }
        }}
      />
      <Button title="Back to Home" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 24, marginBottom: 12 },
  price: { fontSize: 20, marginBottom: 20 },
});
