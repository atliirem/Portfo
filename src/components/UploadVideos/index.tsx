import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { addLocalVideo } from "../../redux/Slice/uploadVideosSlice"; 
import Icon from "react-native-vector-icons/MaterialIcons";

interface Props {
  category: string;
}

export default function VideoPickerBox({ category }: Props) {
  const dispatch = useDispatch();


  const videos = useSelector(
    (state: any) => state.videos.local[category] || []
  );

  const pickVideo = () => {
    launchImageLibrary(
      {
        mediaType: "video",
        quality: 0.8,
      },
      (response: any) => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          console.log(response.errorMessage);
          return;
        }

        const uri = response?.assets?.[0]?.uri;

        if (uri) {
          dispatch(addLocalVideo({ category, uri }));
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{category} Video:</Text>

      <TouchableOpacity style={styles.button} onPress={pickVideo}>
        <Text style={styles.buttonText}>Video Yükle</Text>
      </TouchableOpacity>


      {videos.length > 0 ? (
        <View style={styles.previewWrapper}>
          {videos.map((uri: string, index: number) => (
            <View key={index} style={{ position: "relative" }}>
              <Image
                source={{ uri }}
                style={[styles.videoThumb, { opacity: 0.7 }]}
              />

 
              <Icon
                name="play-circle-fill"
                size={40}
                color="white"
                style={styles.playIcon}
              />
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noVideoText}>Henüz video seçilmedi</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 24,
    paddingHorizontal: 16,
    marginTop: 40,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "capitalize",
  },
  button: {
    padding: 10,
    borderRadius: 8,
    width: 150,
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#eee",
  },
  buttonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
  },
  previewWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  videoThumb: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  playIcon: {
    position: "absolute",
    top: 40,
    left: 40,
  },
  noVideoText: {
    color: "gray",
  },
});
