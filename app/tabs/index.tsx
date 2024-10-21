import { Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Link } from "expo-router";

export default function Index() {
  const router = useRouter();
  const email = router.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to HW2 from team14/sublet, {email}!</Text>
      <Link href="/tabs/about" style={styles.button}>
        Go to About
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "blue",
    color: "white",
    borderRadius: 5,
  },
});

