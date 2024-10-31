import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { auth, db } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { router } from "expo-router";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", email);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        Alert.alert("Thông báo", "Email đã được sử dụng. Vui lòng đăng nhập.");
        console.error("Email đã được sử dụng. Vui lòng đăng nhập.");
        setLoading(false);
        return;
      }

      // Đăng ký người dùng mới trong Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Lưu thông tin người dùng vào Firestore
      await setDoc(userRef, {
        email: userCredential.user.email,
        createdAt: new Date(),
      });

      Alert.alert("Thông báo", "Đăng ký thành công! Bạn có thể đăng nhập ngay.");
      console.log("Đăng ký thành công!");
      router.replace({ pathname: "/login" });
    } catch (error) {
      console.error("Đăng ký thất bại", error);
      Alert.alert("Thông báo", "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button title="Đăng ký" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
  },
});
