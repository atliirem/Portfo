
import React from "react";
import { StyleSheet, Image, View, Dimensions } from "react-native";

// const { width } = Dimensions.get("window");

const Index = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
        style={styles.image}
       source={require('../../../assets/image/logo.png')}
       
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
width: 202,
    height: 42,

    top: -20,
  },
});
