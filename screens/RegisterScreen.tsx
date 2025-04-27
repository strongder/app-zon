import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, MaterialIcons, Feather} from "@expo/vector-icons";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import axiosInstance from "../api";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const handleRegister = async () => {
    if (!phone || !email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    try {
      const response = await axiosInstance.post('/auth/register', {
        email,
        username,
        password,
        phone,
      });

      if (response.status === 201) {
        Alert.alert("Success", "Registration completed successfully!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", response.data.message || "Registration failed");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong, please try again later."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo}>
        <Image
          style={styles.imageLogo}
          source={require("../assets/logo-ecommerce.png")}
        />
      </View>

      <KeyboardAvoidingView style={styles.formContainer}>
        <Text style={styles.headerText}>Register to your Account</Text>

        <View style={styles.inputContainer}>
          <Feather name="phone" size={24} color="black" style={styles.icon}/>
          <TextInput
            value={phone}
            onChangeText={(text) => setPhone(text)}
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons
            name="email"
            size={24}
            color="gray"
            style={styles.icon}
          />
          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <AntDesign name="lock1" size={24} color="gray" style={styles.icon} />
          <TextInput
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#888"
          />
        </View>

        <Pressable onPress={handleRegister} style={styles.registerButton}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Login")}
          style={styles.signInLink}
        >
          <Text style={styles.signInText}>
            Already have an account? Sign In
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 50,
  },
  logo: {
    marginTop: 50,
    width: 300,
    height: 100,
  },
  imageLogo: {
    width: "100%",
    height: "100%",
  },
  formContainer: {
    marginTop: 20,
    width: "90%",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#041E42",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  registerButton: {
    backgroundColor: "#FEBE10",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  signInLink: {
    marginTop: 15,
  },
  signInText: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
  },
});
