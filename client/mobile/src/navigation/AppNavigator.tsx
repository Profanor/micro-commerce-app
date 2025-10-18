import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import HomeScreen from "../screens/HomeScreen";
import ProductDetailScreen from "../screens/productDetailScreen";
import CartScreen from "../screens/CartScreen";
import OrdersScreen from "../screens/OrdersScreen";
import OrderSummaryScreen from "../screens/OrderSummaryScreen";
import CartIcon from "../components/CartIcon";
import { AuthContext } from "../context/AuthContext";
import SellerApplicationScreen from "../screens/SellerApplicationScreen";

const Stack = createNativeStackNavigator();

function AppStack() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {/* home and product detail are public */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Products", headerRight: () => <CartIcon /> }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: "Product Details", headerRight: () => <CartIcon /> }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: "Your Cart" }}
      />

      {/* protected screens — only available when logged in */}
      {user && (
        <>
          <Stack.Screen
            name="Orders"
            component={OrdersScreen}
            options={{ title: "Orders" }}
          />
          <Stack.Screen
            name="OrderSummary"
            component={OrderSummaryScreen}
            options={{ title: "Order Summary" }}
          />
          <Stack.Screen
            name="SellerApplication"
            component={SellerApplicationScreen}
            options={{ title: "Seller Information" }}
          />
        </>
      )}

      {/* auth screens — only show if not logged in */}
      {!user && (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}
