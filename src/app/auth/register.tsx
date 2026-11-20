import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { registerUser } from "../../services/auth";

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      await registerUser({
        username,
        email: email.trim().toLowerCase(),
        password,
      });

      Alert.alert("Success", "Account created successfully.", [
        {
          text: "Continue",
          onPress: () => router.replace("/auth/login"),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Could not create your account.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View>
        <Text style={styles.logo}>note.</Text>

        <Text style={styles.title}>Create your account.</Text>

        <Text style={styles.description}>
          Start keeping track of the things that matter.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor="#666666"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#666666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#666666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor="#666666"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <Pressable
            style={styles.button}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>

        <Pressable onPress={() => router.push("/auth/login")}>
          <Text style={styles.loginButton}>Login</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 28,
    paddingTop: 65,
    paddingBottom: 30,
    justifyContent: "space-between",
  },
  logo: {
    color: "#F5F1E8",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 35,
  },
  title: {
    color: "#F5F1E8",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 10,
  },
  description: {
    color: "#999999",
    fontSize: 14,
    marginBottom: 30,
  },
  form: {
    gap: 12,
  },
  label: {
    color: "#F5F1E8",
    fontSize: 13,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#303030",
    borderRadius: 10,
    padding: 15,
    color: "#F5F1E8",
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#D97745",
    paddingVertical: 17,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#121212",
    fontSize: 15,
    fontWeight: "700",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  loginText: {
    color: "#999999",
    fontSize: 13,
  },
  loginButton: {
    color: "#D97745",
    fontSize: 13,
    fontWeight: "700",
  },
});
