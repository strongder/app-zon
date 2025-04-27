import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  Pressable,
  ScrollView, // Import ScrollView
  SafeAreaView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch } from "react-redux";
import { fetchCurrentUser, updateProfile } from "../redux/UserSlice";

const EditProfileScreen = ({ navigation, route }: any) => {
  const dispatch = useDispatch();
  const { currentUser } = route.params;

  const [username, setUsername] = useState(currentUser?.username || "");
  const [firstName, setFirstName] = useState(currentUser?.firstName || "");
  const [lastName, setLastName] = useState(currentUser?.lastName || "");
  const [password, setPassword] = useState<any>();
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [birthday, setBirthday] = useState(currentUser?.birthday || "");

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleChooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handlePickImage = async () => {
    Alert.alert(
      "Chọn ảnh",
      "Chọn ảnh từ thư viện hoặc chụp ảnh mới",
      [
        {
          text: "Chụp ảnh",
          onPress: handleImagePicker,
        },
        {
          text: "Chọn ảnh",
          onPress: handleChooseImage,
        },
      ],
      { cancelable: true }
    );
  };

  const handleUpdateProfile = () => {
    const updatedUser = {
      username,
      firstName,
      lastName,
      password,
      avatar,
      address,
      birthday,
    };
    if (!password) {
      delete updatedUser.password;
    }
    console.log("updated user", updatedUser);
    dispatch(updateProfile({ data: updatedUser }));
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={handlePickImage}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
        </TouchableOpacity>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Họ</Text>
        <TextInput
          style={styles.input}
          placeholder="Họ"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Tên</Text>
        <TextInput
          style={styles.input}
          placeholder="Tên"
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Mật khẩu mới</Text>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Địa chỉ</Text>
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ"
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>Ngày sinh</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={birthday}
          onChangeText={setBirthday}
        />
      </ScrollView>
      <Pressable style={styles.buttonContainer} onPress={handleUpdateProfile}>
        <Text style={{ color: "black", textAlign: "center" }}>Cập nhật</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  buttonContainer: {
    padding: 12,
    backgroundColor: "orange",
    borderRadius: 5,
    margin: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
  },
});

export default EditProfileScreen;