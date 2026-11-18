
import { Text, View, StyleSheet, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.container}>
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
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#666666"
            secureTextEntry
          />

          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Login </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account?</Text>

        <Pressable onPress={() => router.push("/auth/register")}>
          <Text style={styles.registerButton}>Create one</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
