import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useAppSelector } from "../../../redux/Hooks";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../../navigation/Navbar/HomeStack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = 400;
const CATEGORY_SCROLL_STEP = 220;

interface ImageItem {
  id: number;
  small: string;
  large: string;
}

const isValidImageUrl = (url: any): boolean => {
  if (!url) return false;
  if (typeof url !== "string") return false;
  const t = url.trim();
  if (!t || t === "-") return false;
  return true;
};

const BannerPhoto = ({ id }: { id: number }) => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const insets = useSafeAreaInsets();
  const { property, loading } = useAppSelector((state) => state.properties);

  const mountedRef = useRef(true);
  const categoryScrollRef = useRef<ScrollView>(null);
  const imageListRef = useRef<FlatList<ImageItem>>(null);

  const [selectedBanner, setSelectedBanner] = useState<string>("Tümü");

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const galleries = useMemo(() => {
    if (!property || property.id !== id) return [];
    const all = property.galleries || [];

    return all.filter((g: any) => {
      if (!g || !Array.isArray(g.images)) return false;
      return g.images.some((img: any) => {
        const path = img?.path?.small || img?.path?.large || img?.path;
        return isValidImageUrl(path);
      });
    });
  }, [property, id]);

  const bannerTitles = useMemo(() => {
    if (galleries.length === 0) return [];
    if (galleries.length === 1) return [galleries[0].title];
    return ["Tümü", ...galleries.map((g: any) => g.title)];
  }, [galleries]);

  useEffect(() => {
    if (!mountedRef.current) return;

    if (bannerTitles.length === 0) {
      if (selectedBanner !== "Tümü") setSelectedBanner("Tümü");
      return;
    }

    if (!bannerTitles.includes(selectedBanner)) {
      setSelectedBanner(bannerTitles[0]);
    }
  }, [bannerTitles, selectedBanner]);

  const selectedImages: ImageItem[] = useMemo(() => {
    const mapImages = (images: any[]): ImageItem[] => {
      if (!Array.isArray(images)) return [];
      return images
        .map((img: any) => {
          const small = img?.path?.small || img?.path;
          const large = img?.path?.large || img?.path?.small || img?.path;
          if (!isValidImageUrl(small) && !isValidImageUrl(large)) return null;
          return {
            id: img.id,
            small: isValidImageUrl(small) ? small : large,
            large: isValidImageUrl(large) ? large : small,
          } as ImageItem;
        })
        .filter(Boolean) as ImageItem[];
    };

    if (selectedBanner === "Tümü") {
      return galleries.flatMap((g: any) => mapImages(g.images));
    }

    const g = galleries.find((x: any) => x.title === selectedBanner);
    return mapImages(g?.images);
  }, [galleries, selectedBanner]);


  useEffect(() => {
    if (!imageListRef.current) return;
    try {
      imageListRef.current.scrollToOffset({ offset: 0, animated: false });
    } catch {}
  }, [selectedBanner]);

const openFullScreenGallery = useCallback(
  (index: number) => {
    if (!selectedImages || selectedImages.length === 0) return;

    const viewerImages = selectedImages
      .filter((img) => isValidImageUrl(img.large))
      .map((img) => ({ uri: img.large }));

    if (viewerImages.length === 0) return;

    const safeIndex = Math.min(Math.max(index, 0), viewerImages.length - 1);


    navigation.navigate("FullScreenGallery", {
      images: viewerImages,
      startIndex: safeIndex,
    });
  },
  [navigation, selectedImages]
);

  const scrollCategory = useCallback((dir: "left" | "right") => {
    const ref = categoryScrollRef.current;
    if (!ref) return;
    try {
      ref.scrollTo({ x: dir === "right" ? CATEGORY_SCROLL_STEP : 0, animated: true });
    } catch {}
  }, []);

  const renderCategoryButtons = () => {
    if (galleries.length === 0) return null;

    return (
      <View style={[styles.categoryBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <TouchableOpacity onPress={() => scrollCategory("left")} style={styles.navButton} activeOpacity={0.8}>
          <Ionicons name="chevron-back-outline" size={28} color="#1a8b95" />
        </TouchableOpacity>

        <ScrollView
          horizontal
          ref={categoryScrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
        >
          {bannerTitles.map((title) => {
            const isSelected = selectedBanner === title;

            const count =
              title === "Tümü"
                ? galleries.flatMap((g: any) => g.images || []).filter((img: any) => {
                    const path = img?.path?.small || img?.path?.large || img?.path;
                    return isValidImageUrl(path);
                  }).length
                : galleries.find((g: any) => g.title === title)?.images?.filter((img: any) => {
                    const path = img?.path?.small || img?.path?.large || img?.path;
                    return isValidImageUrl(path);
                  }).length || 0;

            if (count === 0) return null;

            return (
              <TouchableOpacity
                key={title}
                style={[styles.categoryButton, isSelected && styles.categoryButtonActive]}
                onPress={() => setSelectedBanner(title)}
                activeOpacity={0.85}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                  {title} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity onPress={() => scrollCategory("right")} style={styles.navButton} activeOpacity={0.8}>
          <Ionicons name="chevron-forward-outline" size={28} color="#1a8b95" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading && galleries.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a8b95" />
      </View>
    );
  }

  if (selectedImages.length === 0) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.noImageContainer}>
          <Ionicons name="image-outline" size={60} color="#ccc" />
          <Text style={styles.noImageText}>Resim bulunamadı</Text>
        </View>
        {renderCategoryButtons()}
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={imageListRef}
        data={selectedImages}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => openFullScreenGallery(index)}
            activeOpacity={0.9}
            style={styles.imageContainer}
          >
            <Image source={{ uri: item.small }} style={styles.mainImage} resizeMode="cover" />
          </TouchableOpacity>
        )}
      />

      {renderCategoryButtons()}
    </View>
  );
};

export default BannerPhoto;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: IMAGE_HEIGHT + 60,
    backgroundColor: "#fff",
  },
  center: {
    height: IMAGE_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width,
    height: IMAGE_HEIGHT,
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  noImageContainer: {
    height: IMAGE_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  noImageText: {
    marginTop: 10,
    fontSize: 14,
    color: "#999",
  },

   categoryBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    minHeight: 55,
  },
  navButton: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  categoryContent: {
    paddingHorizontal: 6,
    gap: 8,
    alignItems: "center",
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#E5E5E5",
    minWidth: 80,
    minHeight: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryButtonActive: {
    backgroundColor: "#25C5D1",
  },
  categoryText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#333",
  },
  categoryTextActive: {
    color: "#fff",
  },
});
