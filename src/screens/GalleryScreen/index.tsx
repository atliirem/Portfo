import React from "react";
import { View, StyleSheet, TouchableOpacity,  } from "react-native";
import ImageViewing from "react-native-image-viewing";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/Navbar/HomeStack";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<HomeStackParamList, "GalleryScreen">;

const GalleryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { images, startIndex } = route.params;

  const formattedImages = images.map((img) => ({ uri: img.path.small }));

  const handleClose = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <ImageViewing
        images={formattedImages}
        imageIndex={startIndex}
        visible={true}
        onRequestClose={handleClose}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />
      <SafeAreaView style={styles.headerContainer} pointerEvents="box-none">
        <TouchableOpacity 
          onPress={handleClose} 
          style={styles.closeButton}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={30} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: "flex-end",
    padding: 20,
  },
  closeButton: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 25,
  },
});

export default GalleryScreen;