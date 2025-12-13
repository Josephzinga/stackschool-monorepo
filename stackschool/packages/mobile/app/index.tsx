import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function Index() {
  const { user } = useUser();
  return (
    <View style={styles.container}>
      <Text>Welcome to the Mobile App!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
