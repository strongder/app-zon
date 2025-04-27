import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/AuthSlice";
import { fetchCurrentUser } from "../redux/UserSlice";
import { RootState } from "../store";

const LoginScreen = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const [isLogin, setIsLogin] = useState(false);
  const dispatch = useDispatch();
  const userCurrent: any = useSelector(
    (state: RootState) => state.users.currentUser
  );

  useEffect(() => {
    if (isLogin) {
      dispatch(fetchCurrentUser());
      navigation.goBack();
    }
  }, [isLogin]);

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage("Username và password không được bỏ trống.");
      return;
    }
    try {
      const action = await dispatch(login({ username, password }));
    
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setIsLogin(true);
      } else {
        setErrorMessage("Đăng nhập thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi, vui lòng thử lại.");
      console.log(error);
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

      <KeyboardAvoidingView
        behavior="padding"
        style={styles.keyboardAvoidingView}
      >
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <MaterialIcons
              style={styles.icon}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              placeholder="Nhập username"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <AntDesign
              name="lock1"
              size={24}
              color="gray"
              style={styles.icon}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              style={styles.input}
              placeholder="Nhập mật khẩu"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.forgotPassword}>Quên mật khẩu</Text>
        </View>

        <Pressable onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={styles.registerLink}
        >
          <Text style={styles.registerText}>Chưa có tài khoản? Đăng ký</Text>
        </Pressable>
        {/* <Pressable
          onPress={() => navigation.navigate("WebAuthn")}
          style={styles.registerLink}
        >
          <Text style={styles.registerText}>Đăng nhập bằng vân tay</Text>
        </Pressable> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    marginTop: 50,
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
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center", // Center content vertically
  },
  centered: {
    alignItems: "center",
  },
  headerText: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 12,
    color: "#041E42",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  inputWrapper: {
    marginTop: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D0D0D0",
    paddingVertical: 5,
    borderRadius: 5,
  },
  icon: {
    marginLeft: 8,
  },
  input: {
    color: "gray",
    marginVertical: 10,
    width: 300,
    fontSize: 16,
  },
  footer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  forgotPassword: {
    color: "#007FFF",
    fontWeight: "500",
  },
  loginButton: {
    width: 200,
    backgroundColor: "#FEBE10",
    borderRadius: 6,
    padding: 15,
    marginTop: 80,
    alignSelf: "center",
  },
  loginButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 15,
  },
  registerText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
  },
});

export default LoginScreen;
