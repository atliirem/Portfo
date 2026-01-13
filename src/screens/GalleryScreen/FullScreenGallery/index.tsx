import React from "react";
import { View, StyleSheet, Text } from "react-native";
import ImageViewing from "react-native-image-viewing";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../../navigation/Navbar/HomeStack"

type Props = NativeStackScreenProps<HomeStackParamList, "FullScreenGallery">;

const FullScreenGallery: React.FC<Props> = ({ route, navigation }) => {
  const { images, startIndex } = route.params;

  return (
    <View style={styles.container}>
      <ImageViewing
        images={images}
        imageIndex={startIndex}
        visible={true}
        onRequestClose={() => navigation.goBack()}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
        FooterComponent={({ imageIndex }) => (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {imageIndex + 1} / {images.length}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default FullScreenGallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  footer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
});