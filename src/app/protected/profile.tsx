import { Text, View, StyleSheet } from "react-native";

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>note.</Text>

      <Text style={styles.title}>Profile</Text>

      <Text style={styles.description}>
        Manage your account details.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 28,
    paddingTop: 65,
  },
  logo: {
    color: "#F5F1E8",
    fontSize: 30,
    fontWeight: "800",
  },
  title: {
    color: "#F5F1E8",
    fontSize: 36,
    fontWeight: "800",
    marginTop: 60,
  },
  description: {
    color: "#999999",
    fontSize: 15,
    marginTop: 12,
  },
});