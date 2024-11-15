
import { View, Text, Image, StyleSheet } from "react-native";

export const Header = () => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    }}
  >
    <Text style={styles.title}>
      quick<Text style={styles.titleAccent}>cal</Text>
    </Text>
    <Image
      source={require("../assets/images/bolt.png")}
      style={{ width: 28, height: 45, resizeMode: "contain" }}
    />
  </View>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 42,
    fontWeight: "200",
    color: "#fff",
    letterSpacing: -1,
  },
  titleAccent: {
    fontWeight: "600",
  },
});