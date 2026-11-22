import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { registerUser } from "../../services/auth";

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !username.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      await registerUser({
        username: username.trim(),
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
      console.log("REGISTER ERROR:", error);
      Alert.alert("Error", "Could not create your account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
              editable={!isLoading}
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
              editable={!isLoading}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#666666"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#666666"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!isLoading}
            />

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                isLoading && styles.disabledButton,
              ]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#121212" size="small" />
                  <Text style={styles.buttonText}>
                    Creating account...
                  </Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </Pressable>
          </View>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>

          <Pressable
            style={({ pressed }) => pressed && styles.linkPressed}
            onPress={() => router.push("/auth/login")}
            disabled={isLoading}
          >
            <Text style={styles.loginButton}>Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#121212",
  },
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
  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  disabledButton: {
    opacity: 0.8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  linkPressed: {
    opacity: 0.6,
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
