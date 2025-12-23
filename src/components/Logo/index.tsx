
import React from "react";
import { StyleSheet, Image, View, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const Index = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
        style={styles.image}
       source={require('../../../assets/image/logo.png')}
        resizeMode="contain"
      />
    </View>
  );
};
export default Index;

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
  },
  image: {
    width: 340,
    height: 100,
    top: -50,
  },
});
