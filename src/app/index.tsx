
import { Text, View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>note.</Text>
        <Text style={styles.logoText}>YOUR PERSONAL SPACE</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.tagline}>THINK IT. WRITE IT. KEEP IT.</Text>

        <Text style={styles.title}>
          Capture the{"\n"}
          thought before{"\n"}
          it's gone.
        </Text>

        <Text style={styles.description}>
          Your work, your studies, your ideas.
          Keep everything that matters in one place.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/auth/register")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
         
        </Pressable>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?
          </Text>
          <Pressable onPress={() => router.push("/auth/login")}>
            <Text style={styles.loginButton}>Login</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.footer}>MADE FOR YOUR THOUGHTS.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 25,
    paddingTop: 65,
    paddingBottom: 25,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    color: "#F5F1E8",
    fontSize: 30,
    fontWeight: "800",
  },
  logoText: {
    color: "#777777",
    fontSize: 9,
    letterSpacing: 2,
  },
  content: {
    width: "100%",
  },
  tagline: {
    color: "#D97745",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 20,
  },
  title: {
    color: "#F5F1E8",
    fontSize: 43,
    fontWeight: "800",
    lineHeight: 51,
    marginBottom: 18,
  },
  description: {
    color: "#999999",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#D97745",
    borderRadius: 10,
    marginTop: 90,
    padding: 17,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#121212",
    fontSize: 15,
    fontWeight: "700",
  },
  arrow: {
    color: "#121212",
    fontSize: 18,
    position: "absolute",
    right: 18,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    marginTop: 20,
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
  footer: {
    color: "#555555",
    fontSize: 9,
    letterSpacing: 2,
    textAlign: "center",
  },
});
