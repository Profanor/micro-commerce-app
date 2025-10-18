import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CartContext } from "../context/CartContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FooterNav() {
  const navigation = useNavigation<any>();
  const { cart } = useContext(CartContext);
  const [activeTab, setActiveTab] = useState("Home");
  const insets = useSafeAreaInsets(); // 👈 this gets the safe area values

  type TabIconName =
    | "home-outline"
    | "home"
    | "grid-outline"
    | "grid"
    | "cart-outline"
    | "cart"
    | "heart-outline"
    | "heart"
    | "person-outline"
    | "person";

  const tabs: {
    name: string;
    icon: TabIconName;
    activeIcon: TabIconName;
  }[] = [
    { name: "Home", icon: "home-outline", activeIcon: "home" },
    { name: "Categories", icon: "grid-outline", activeIcon: "grid" },
    { name: "Cart", icon: "cart-outline", activeIcon: "cart" },
    { name: "Favorites", icon: "heart-outline", activeIcon: "heart" },
    { name: "Account", icon: "person-outline", activeIcon: "person" },
  ];

  const handlePress = (tabName: string) => {
    setActiveTab(tabName);
    navigation.navigate(tabName);
  };

  return (
    <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tab}
          onPress={() => handlePress(tab.name)}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={activeTab === tab.name ? tab.activeIcon : tab.icon}
              size={24}
              color={activeTab === tab.name ? "#FF6B35" : "#666"}
            />
            {tab.name === "Cart" && cart.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cart.length}</Text>
              </View>
            )}
          </View>
          <Text
            style={[styles.label, activeTab === tab.name && styles.activeLabel]}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingVertical: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -1 },
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconContainer: {
    position: "relative",
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontWeight: "500",
  },
  activeLabel: {
    color: "#FF6B35",
    fontWeight: "700",
  },
  badge: {
    position: "absolute",
    right: -10,
    top: -5,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});
