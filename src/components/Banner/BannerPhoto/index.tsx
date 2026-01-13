import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useRef, useState, useEffect, useMemo } from "react";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useAppSelector } from "../../../redux/Hooks";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../../navigation/Navbar/HomeStack";

const { width } = Dimensions.get("window");

interface ImageItem {
  id: number;
  small: string;
  large: string;
}

const BannerPhoto = ({ id }: { id: number }) => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { property, loading } = useAppSelector((state) => state.properties);

  const scrollViewRef = useRef<ScrollView>(null);
  const [offset, setOffset] = useState(0);
  const [selectedBanner, setSelectedBanner] = useState("Tümü");
  const scrollAmount = 200;


  const galleries = useMemo(() => {
    if (property && property.id === id) {
      return property.galleries || [];
    }
    return [];
  }, [property, id]);


  const bannerTitles = useMemo(() => {
    return ["Tümü", ...galleries.map((g: any) => g.title)];
  }, [galleries]);


  useEffect(() => {
    if (selectedBanner !== "Tümü" && !bannerTitles.includes(selectedBanner)) {
      setSelectedBanner("Tümü");
    }
  }, [bannerTitles, selectedBanner]);


  const selectedImages: ImageItem[] = useMemo(() => {
    const mapImages = (images: any[]): ImageItem[] => {
      return (images || []).map((img: any) => ({
        id: img.id,
        small: img.path?.small || img.path,
        large: img.path?.large || img.path?.small || img.path,
      }));
    };

    if (selectedBanner === "Tümü") {
      return galleries.flatMap((g: any) => mapImages(g.images));
    }

    const selectedGallery = galleries.find((g: any) => g.title === selectedBanner);
    return mapImages(selectedGallery?.images);
  }, [galleries, selectedBanner]);

  const openFullScreenGallery = (index: number) => {
    const viewerImages = selectedImages.map((img) => ({ uri: img.large }));
    navigation.navigate("FullScreenGallery", {
      images: viewerImages,
      startIndex: index,
    });
  };

  
  const scrollRight = () => {
    const newOffset = offset + scrollAmount;
    scrollViewRef.current?.scrollTo({ x: newOffset, animated: true });
    setOffset(newOffset);
  };

  const scrollLeft = () => {
    const newOffset = Math.max(offset - scrollAmount, 0);
    scrollViewRef.current?.scrollTo({ x: newOffset, animated: true });
    setOffset(newOffset);
  };


  const renderCategoryButtons = () => {
    if (galleries.length === 0) return null;

    return (
      <View style={styles.categoryContainer}>
        <TouchableOpacity onPress={scrollLeft} style={styles.navButton}>
          <Ionicons name="chevron-back-outline" size={30} color="#1a8b95" />
        </TouchableOpacity>

        <ScrollView
          horizontal
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
        >
          {bannerTitles.map((item) => {
            const isSelected = selectedBanner === item;
            const count =
              item === "Tümü"
                ? galleries.flatMap((g: any) => g.images || []).length
                : galleries.find((g: any) => g.title === item)?.images?.length || 0;

            return (
              <TouchableOpacity
                key={item}
                style={[styles.categoryButton, isSelected && styles.categoryButtonActive]}
                onPress={() => setSelectedBanner(item)}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                  {item} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity onPress={scrollRight} style={styles.navButton}>
          <Ionicons name="chevron-forward-outline" size={30} color="#1a8b95" />
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
        <Image
          source={{ uri: "https://portfoy.demo.pigasoft.com/default-property-image.jpg" }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        {renderCategoryButtons()}
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.imageScroll}
      >
        {selectedImages.map((item, index) => (
          <TouchableOpacity
            key={`image-${item.id}-${index}`}
            onPress={() => openFullScreenGallery(index)}
            style={styles.imageContainer}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: item.small }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>


      {renderCategoryButtons()}
    </View>
  );
};

export default BannerPhoto;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageScroll: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: "100%",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  categoryContainer: {
    position: "absolute",
    bottom: -50,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  navButton: {
    padding: 5,
  },
  categoryContent: {
    paddingHorizontal: 5,
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#E5E5E5",
    minWidth: 80,
    alignItems: "center",
    minHeight: 38,
  },
  categoryButtonActive: {
    backgroundColor: "#25C5D1",
  },
  categoryText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#333",
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoryTextActive: {
    color: "#fff",
  },
});