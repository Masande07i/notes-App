import { Text, View, StyleSheet } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>note.</Text>

      <Text style={styles.title}>Your notes.</Text>

      <Text style={styles.description}>
        Your personal space for everything worth remembering.
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
    lineHeight: 24,
    marginTop: 12,
  },
});