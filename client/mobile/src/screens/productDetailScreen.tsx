import React, { useContext, useState } from "react";
import { View, Text, Button, StyleSheet, Alert, Image } from "react-native";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function ProductDetailScreen({ route, navigation }: any) {
  const { user } = useContext(AuthContext);
  const { product } = route.params;
  const { addToCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = () => {
    if (!user) {
      navigation.navigate("Login");
      return;
    }

    addToCart(product);
    Alert.alert("Added to Cart", "Item added successfully 🛒");
  };

  return (
    <View style={styles.container}>
      {product.image ? (
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : null}
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Button
        title={loading ? "Adding..." : "Add to Cart"}
        onPress={handleAddToCart}
        disabled={loading}
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
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  title: { fontSize: 24, marginBottom: 12 },
  price: { fontSize: 20, marginBottom: 20 },
});
