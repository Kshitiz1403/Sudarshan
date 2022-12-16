import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const Progress = ({ length, activeIndex }) => {
  const bars = new Array(length);
  bars.fill("rgba(255,255,255,0.5)")
  bars[activeIndex] = "white"
  let count = 0;
  return (
    <View style={styles.iconsView}>
      {bars.map(color => <FontAwesome name="circle" style={styles.icon} size={13} color={color} key={count++} />)}
    </View>
  );
};

const styles = StyleSheet.create({
  iconsView: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 15,
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 10,
  },
});
export default Progress;
