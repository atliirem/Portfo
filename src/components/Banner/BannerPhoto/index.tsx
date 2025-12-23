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
import React, { useRef, useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { getProperties } from "../../../../api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  HomeStackParamList,
  GalleryImage,
} from "../../../navigation/Navbar/HomeStack";

const { width } = Dimensions.get("window");

const IndexProps = ({ id }: { id: number }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const dispatch = useAppDispatch();
  const { property, loading } = useAppSelector((state) => state.properties);

  const scrollViewRef = useRef<ScrollView>(null);
  const [offset, setOffset] = useState(0);
  const scrollAmount = 200;

  useEffect(() => {
    if (id) {
      dispatch(getProperties(id));
    }
  }, [id]);

  const galleries = property?.galleries || [];
  const bannerTitles = ["Tümü", ...galleries.map((g: any) => g.title)];
  const [selectedBanner, setSelectedBanner] = useState("Tümü");

  const selectedGallery = galleries.find(
    (g: any) => g.title === selectedBanner
  );

  const selectedImages: GalleryImage[] =
    selectedBanner === "Tümü"
      ? galleries.flatMap((g: any) =>
          g.images.map(
            (img: any): GalleryImage => ({
              id: img.id,
              path: { small: img.path.small },
            })
          )
        )
      : selectedGallery?.images.map(
          (img: any): GalleryImage => ({
            id: img.id,
            path: { small: img.path.small },
          })
        ) || [];

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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a8b95" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
    
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.mainImageScroll}
      >
        {selectedImages.length > 0 &&
          selectedImages.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                navigation.navigate("GalleryScreen", {
                  images: selectedImages,
                  startIndex: index,
                })
              }
              style={styles.mainImageContainer}
            >
              <Image
                source={{ uri: item.path.small }}
                style={styles.mainImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
      </ScrollView>


      <View style={styles.container}>
        <TouchableOpacity onPress={scrollLeft} style={styles.navButton}>
          <Ionicons name="chevron-back-outline" size={33} color={"#1a8b95"} />
        </TouchableOpacity>

        <ScrollView
          horizontal
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {bannerTitles.map((item) => {
            const isSelected = selectedBanner === item;
            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.button,
                  { backgroundColor: isSelected ? "#25C5D1" : "#E5E5E5" },
                ]}
                onPress={() => setSelectedBanner(item)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: isSelected ? "#fff" : "#333" },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity onPress={scrollRight} style={styles.navButton}>
          <Ionicons
            name="chevron-forward-outline"
            size={30}
            color={"#1a8b95"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IndexProps;

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


  mainImageScroll: {
    flex: 1,
  },

  mainImageContainer: {
    width: width,
    height: "100%",
  },

  mainImage: {
    width: "100%",
    height: "100%",
  },

  container: {
    position: "absolute",
    bottom: -50,
    left: -10,
    right: -10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },

  navButton: {
    padding: 5,
 
   
   
  },

  categoryScroll: {
  flex: 1,
  marginHorizontal: -4,  
},

  button: {
    paddingVertical: 0,
    paddingHorizontal: 4.5,
    marginHorizontal: 4.5,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 160,
    minHeight: 40,
    left: -2
  },

  buttonText: {
    fontWeight: "600",
    textAlign: "center",
    fontSize: 14,
  },
});