import { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { logoutUser } from "../../services/auth";
import AddNoteModal from"../../components/addNoteModal";

export default function Home() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.buttonText}>+ Add Note</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>

      <AddNoteModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
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
  logoutButton: {
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 12,
  },
  logoutText: {
    color: "#999999",
    fontSize: 14,
    fontWeight: "600",
  },
});
