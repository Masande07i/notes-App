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
import { loginUser } from "../../services/auth";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);

      await loginUser(email.trim().toLowerCase(), password);

      router.replace("/protected/home");
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      Alert.alert("Login Failed", "Invalid email or password.");
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

          <Text style={styles.title}>Welcome back.</Text>

          <Text style={styles.description}>
            Sign in to continue to your notes.
          </Text>

          <View style={styles.form}>
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

            <Pressable
              style={({ pressed }) => [
                styles.button,
                (pressed || isLoading) && styles.buttonPressed,
                isLoading && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#121212" size="small" />
                  <Text style={styles.buttonText}>Logging in...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </Pressable>
          </View>
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>

          <Pressable
            style={({ pressed }) => pressed && styles.linkPressed}
            onPress={() => router.push("/auth/register")}
            disabled={isLoading}
          >
            <Text style={styles.registerButton}>Create one</Text>
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
  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  disabledButton: {
    opacity: 0.8,
  },
  linkPressed: {
    opacity: 0.6,
  },
  logo: {
    color: "#F5F1E8",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 35,
  },
  title: {
    color: "#F5F1E8",
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 10,
  },
  description: {
    color: "#999999",
    fontSize: 14,
    marginBottom: 35,
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
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buttonText: {
    color: "#121212",
    fontSize: 15,
    fontWeight: "700",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  registerText: {
    color: "#999999",
    fontSize: 13,
  },
  registerButton: {
    color: "#D97745",
    fontSize: 13,
    fontWeight: "700",
  },
});
