import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  getCurrentUser,
  updateUserProfile,
  logoutUser,
  User,
} from "../../services/auth";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        router.replace("/auth/login");
        return;
      }

      setUser(currentUser);
      setUsername(currentUser.username);
      setEmail(currentUser.email);
    };

    loadProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!username.trim() || !email.trim() || !currentPassword) {
      Alert.alert("Missing information", "Please fill in all required fields.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      Alert.alert(
        "Invalid password",
        "Your new password must have at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Password mismatch", "Your new passwords do not match.");
      return;
    }

    try {
      const updatedUser = await updateUserProfile(
        username.trim(),
        email.trim(),
        currentPassword,
        newPassword || undefined
      );

      setUser(updatedUser);
      setUsername(updatedUser.username);
      setEmail(updatedUser.email);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      Alert.alert("Success", "Your profile has been updated.");
    } catch (error) {
      Alert.alert(
        "Update failed",
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logoutUser();
            router.replace("/auth/login");
          },
        },
      ]
    );
  };

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.logo}>note.</Text>

        <Text style={styles.title}>Your profile.</Text>
        <Text style={styles.description}>
          Manage your account details.
        </Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {username.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.profileName}>{username}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account details</Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor="#777777"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            placeholderTextColor="#777777"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Change password</Text>

          <Text style={styles.label}>Current password *</Text>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            placeholderTextColor="#777777"
            secureTextEntry
          />

          <Text style={styles.label}>New password</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            placeholderTextColor="#777777"
            secureTextEntry
          />

          <Text style={styles.label}>Confirm new password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            placeholderTextColor="#777777"
            secureTextEntry
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.updateButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleUpdateProfile}
        >
          <Text style={styles.updateButtonText}>Save changes</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    padding: 25,
    paddingTop: 55,
    paddingBottom: 45,
  },
  logo: {
    color: "#D97745",
    fontSize: 29,
    fontWeight: "800",
    marginBottom: 35,
  },
  title: {
    color: "#F5F1E8",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 9,
  },
  description: {
    color: "#999999",
    fontSize: 14,
    marginBottom: 30,
  },
  profileCard: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#303030",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
    marginBottom: 35,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#D97745",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  avatarText: {
    color: "#121212",
    fontSize: 27,
    fontWeight: "800",
  },
  profileName: {
    color: "#F5F1E8",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
  },
  profileEmail: {
    color: "#999999",
    fontSize: 13,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#F5F1E8",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    color: "#CCCCCC",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 9,
  },
  input: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#303030",
    borderRadius: 9,
    padding: 15,
    color: "#F5F1E8",
    fontSize: 14,
    marginBottom: 18,
  },
  updateButton: {
    backgroundColor: "#D97745",
    paddingVertical: 17,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  updateButtonText: {
    color: "#121212",
    fontSize: 15,
    fontWeight: "700",
  },
  logoutButton: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#D97745",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#D97745",
    fontSize: 15,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
