import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ProductDetailScreen from "../screens/productDetailScreen";
import CartScreen from "../screens/CartScreen";
import OrdersScreen from "../screens/OrdersScreen";
import CartIcon from "../components/CartIcon";
import { AuthContext } from "../context/AuthContext";
import OrderSummaryScreen from "../screens/OrderSummaryScreen";

const Stack = createNativeStackNavigator();

function AppStack() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {/* guests and logged-in users start here */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: true,
          title: "Products",
          headerRight: () => <CartIcon />,
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: "Product Details",
          headerRight: () => <CartIcon />,
        }}
      />

      {/* auth-only screens */}
      {user && (
        <>
          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={{ title: "Your Cart" }}
          />
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
        </>
      )}

      {/* login available if user not logged in */}
      {!user && (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
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
