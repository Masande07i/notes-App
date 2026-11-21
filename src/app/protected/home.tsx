import { Text, View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { logoutUser } from "../../services/auth";

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>note.</Text>

      <Text style={styles.title}>Your notes.</Text>

      <Text style={styles.description}>
        Your personal space for everything worth remembering.
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 28,
    justifyContent: "center",
  },
  logo: {
    color: "#D97745",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 30,
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
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#D97745",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#121212",
    fontSize: 15,
    fontWeight: "700",
  },
});