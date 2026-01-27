import React, { useCallback, useEffect } from "react";
import { View, StyleSheet, Text, BackHandler } from "react-native";
import ImageViewing from "react-native-image-viewing";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

type FullScreenGalleryParams = {
  FullScreenGallery: {
    images: { uri: string }[];
    startIndex: number;
  };
};

type Props = NativeStackScreenProps<FullScreenGalleryParams, "FullScreenGallery">;

const FullScreenGallery: React.FC<Props> = ({ route, navigation }) => {
  const params = route.params || { images: [], startIndex: 0 };
  const { images = [], startIndex = 0 } = params;
  const insets = useSafeAreaInsets();

  const safeStartIndex = Math.min(
    Math.max(startIndex || 0, 0),
    Math.max((images?.length || 1) - 1, 0)
  );

  // ✅ Yeni BackHandler syntax
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
        return true;
      };

      // Yeni: subscription pattern
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

      // Cleanup
      return () => subscription.remove();
    }, [navigation])
  );

  const handleClose = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  // Resim yoksa geri dön
  if (!images || images.length === 0) {
    // useEffect içinde goBack çağır
    useEffect(() => {
      const timer = setTimeout(() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }, 100);
      return () => clearTimeout(timer);
    }, []);

    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Görüntülenecek resim yok</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageViewing
        images={images}
        imageIndex={safeStartIndex}
        visible={true}
        onRequestClose={handleClose}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
        presentationStyle="fullScreen"
        FooterComponent={({ imageIndex }) => (
          <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
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
  emptyText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
  },
  footer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 15,
  },
  footerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
});