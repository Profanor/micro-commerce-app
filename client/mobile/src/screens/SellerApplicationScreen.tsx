import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  Home: undefined;
  SellerApplication: undefined;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SellerApplication"
>;

interface SellerFormData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  category: string;
  description: string;
}

const SellerApplicationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [form, setForm] = useState<SellerFormData>({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    category: "",
    description: "",
  });

  const handleChange = (key: keyof SellerFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const { name, email, businessName } = form;

    if (!name || !email || !businessName) {
      Alert.alert("Incomplete", "Please fill in all required fields.");
      return;
    }

    // 🔧 TODO: connect to your backend (Firebase, Supabase, or custom API)
    console.log("Submitting seller application:", form);

    Alert.alert("✅ Success", "Your application has been submitted!");
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Ionicons
        name="briefcase-outline"
        size={48}
        color="#FF6B35"
        style={{ marginBottom: 8 }}
      />

      <Text style={styles.title}>Become an inSync Seller</Text>
      <Text style={styles.subtitle}>
        Join thousands of trusted sellers growing with us 💼
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#888"
        value={form.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#888"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(text) => handleChange("phone", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Business Name"
        placeholderTextColor="#888"
        value={form.businessName}
        onChangeText={(text) => handleChange("businessName", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Product Category (e.g. Bags, Shoes)"
        placeholderTextColor="#888"
        value={form.category}
        onChangeText={(text) => handleChange("category", text)}
      />

      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Tell us about your business..."
        placeholderTextColor="#888"
        multiline
        numberOfLines={4}
        value={form.description}
        onChangeText={(text) => handleChange("description", text)}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Application</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SellerApplicationScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B35",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#F9F9F9",
    borderColor: "#EEE",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 15,
    color: "#333",
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 14,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submitText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
  backText: {
    color: "#FF6B35",
    fontSize: 15,
    textDecorationLine: "underline",
  },
});
