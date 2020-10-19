import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Calendar from "./component/Calendar/Calendar";

export default function App() {
  return (
    <>
      <Calendar />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
