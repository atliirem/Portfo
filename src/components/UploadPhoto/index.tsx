import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";


interface Props {
  category: string; 
}

export default function ImagePickerBox({ category }: Props) {
  const dispatch = useDispatch();


  const images = useSelector((state: any) => state.images.local[category] || []);

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
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
          dispatch(addLocalImage({ category, uri }));
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{category} Fotoğraf:</Text>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Yükle</Text>
      </TouchableOpacity>


      {images.length > 0 ? (
        <View style={styles.previewWrapper}>
          {images.map((uri: string, index: number) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
        </View>
      ) : (
        <Text style={styles.noImageText}>Henüz resim seçilmedi</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 24,
    paddingHorizontal: 16,
    marginTop: 40

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
    width: 130,
    alignItems: "center",
    marginBottom: 12,
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
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  noImageText: {
    color: "gray",
  },
});
function addLocalImage(arg0: { category: string; uri: any; }): any {
  throw new Error("Function not implemented.");
}


