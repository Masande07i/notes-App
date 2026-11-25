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
import { Ionicons } from "@expo/vector-icons";
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

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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
      Alert.alert(
        "Missing information",
        "Please fill in all required fields."
      );
      return;
    }

    try {
      const updatedUser = await updateUserProfile(
        username.trim(),
        email.trim(),
        currentPassword
      );

      setUser(updatedUser);
      setUsername(updatedUser.username);
      setEmail(updatedUser.email);
      setCurrentPassword("");
      setIsEditingProfile(false);

      Alert.alert("Success", "Your profile has been updated.");
    } catch (error) {
      Alert.alert(
        "Update failed",
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(
        "Missing information",
        "Please fill in all password fields."
      );
      return;
    }

    if (newPassword.length < 6) {
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
        username,
        email,
        currentPassword,
        newPassword
      );

      setUser(updatedUser);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);

      Alert.alert("Success", "Your password has been changed.");
    } catch (error) {
      Alert.alert(
        "Update failed",
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  };

  const handleCancelProfileEdit = () => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }

    setCurrentPassword("");
    setIsEditingProfile(false);
  };

  const handleCancelPasswordChange = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsChangingPassword(false);
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
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/protected/home")}
          >
            <Ionicons name="arrow-back" size={22} color="#F5F1E8" />
          </Pressable>

          <Text style={styles.logo}>note.</Text>
        </View>

        <Text style={styles.title}>Your profile.</Text>

        <Text style={styles.description}>
          Manage your account details.
        </Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.username.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.profileName}>{user.username}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account details</Text>

            {!isEditingProfile && (
              <Pressable
                style={({ pressed }) => [
                  pressed && styles.smallButtonPressed,
                ]}
                onPress={() => setIsEditingProfile(true)}
              >
                <Text style={styles.editText}>Edit Profile</Text>
              </Pressable>
            )}
          </View>

          {isEditingProfile ? (
            <>
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

              <Text style={styles.label}>Current password *</Text>

              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password to save"
                placeholderTextColor="#777777"
                secureTextEntry
              />

              <Pressable
                style={({ pressed }) => [
                  styles.updateButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.updateButtonText}>Save Changes</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleCancelProfileEdit}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.label}>Username</Text>

              <View style={styles.detailBox}>
                <Text style={styles.detailText}>{user.username}</Text>
              </View>

              <Text style={styles.label}>Email address</Text>

              <View style={styles.detailBox}>
                <Text style={styles.detailText}>{user.email}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Password</Text>

            {!isChangingPassword && (
              <Pressable
                style={({ pressed }) => [
                  pressed && styles.smallButtonPressed,
                ]}
                onPress={() => setIsChangingPassword(true)}
              >
                <Text style={styles.editText}>Change Password</Text>
              </Pressable>
            )}
          </View>

          {isChangingPassword ? (
            <>
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

              <Pressable
                style={({ pressed }) => [
                  styles.updateButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleChangePassword}
              >
                <Text style={styles.updateButtonText}>
                  Update Password
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleCancelPasswordChange}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </>
          ) : (
            <Text style={styles.passwordDescription}>
              Your password is private and securely stored.
            </Text>
          )}
        </View>

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 35,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  logo: {
    color: "#D97745",
    fontSize: 29,
    fontWeight: "800",
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#F5F1E8",
    fontSize: 18,
    fontWeight: "700",
  },
  editText: {
    color: "#D97745",
    fontSize: 13,
    fontWeight: "700",
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
  detailBox: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#303030",
    borderRadius: 9,
    padding: 15,
    marginBottom: 18,
  },
  detailText: {
    color: "#F5F1E8",
    fontSize: 14,
  },
  passwordDescription: {
    color: "#999999",
    fontSize: 13,
    lineHeight: 20,
  },
  updateButton: {
    backgroundColor: "#D97745",
    paddingVertical: 17,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  updateButtonText: {
    color: "#121212",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#444444",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#CCCCCC",
    fontSize: 14,
    fontWeight: "600",
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
  smallButtonPressed: {
    opacity: 0.6,
  },
});
