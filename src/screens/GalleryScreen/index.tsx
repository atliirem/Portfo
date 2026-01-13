import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import Ionicons from "@react-native-vector-icons/ionicons";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { useAppSelector, useAppDispatch } from "../../redux/Hooks";
import { getPropertyById } from "../../../api/CreateThunk";
import { deleteGalleryImage, GalleryCategory, setGalleryCategories, uploadGalleryImage } from "../../redux/Slice/uploadPhotoSlice";


const { width } = Dimensions.get("window");
const IMAGE_SIZE = width * 0.35;

interface GalleryScreenProps {
  propertyId: number;
}

const GalleryScreen: React.FC<GalleryScreenProps> = ({ propertyId }) => {
  const dispatch = useAppDispatch();

  const { property } = useAppSelector((state) => state.properties);
  const { categories, uploading, deleting } = useAppSelector((state) => state.gallery);

  const [uploadingCategoryId, setUploadingCategoryId] = useState<number | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerImages, setViewerImages] = useState<{ uri: string }[]>([]);


  useEffect(() => {
    if (propertyId && (!property || property.id !== propertyId)) {
      dispatch(getPropertyById(propertyId));
    }
  }, [propertyId, dispatch]);


  useEffect(() => {
    if (property?.galleries) {
      dispatch(setGalleryCategories(property.galleries));
    }
  }, [property?.galleries, dispatch]);


  const handlePickImage = (categoryId: number) => {
    Alert.alert("Fotoğraf Ekle", "Nereden eklemek istersiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Galeri",
        onPress: () => {
          launchImageLibrary(
            { mediaType: "photo", selectionLimit: 10, quality: 0.8 },
            (response) => {
              if (!response.didCancel && response.assets) {
                uploadImages(response.assets, categoryId);
              }
            }
          );
        },
      },
      {
        text: "Kamera",
        onPress: () => {
          launchCamera({ mediaType: "photo", quality: 0.8 }, (response) => {
            if (!response.didCancel && response.assets) {
              uploadImages(response.assets, categoryId);
            }
          });
        },
      },
    ]);
  };


  const uploadImages = async (assets: any[], categoryId: number) => {
    setUploadingCategoryId(categoryId);

    try {
      for (const asset of assets) {
        const result = await dispatch(
          uploadGalleryImage({ propertyId, categoryId, asset })
        ).unwrap();
        
        console.log("Upload success:", result);
      }
      Alert.alert("Başarılı", `${assets.length} fotoğraf yüklendi.`);
    } catch (error: any) {
      Alert.alert("Hata", error || "Yüklenemedi.");
    } finally {
      setUploadingCategoryId(null);
    }
  };


  const handleDeleteImage = (imageId: number) => {
    Alert.alert("Sil", "Bu fotoğrafı silmek istiyor musunuz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(deleteGalleryImage({ propertyId, imageId })).unwrap();
            Alert.alert("Başarılı", "Fotoğraf silindi.");
          } catch (error: any) {
            Alert.alert("Hata", error || "Silinemedi.");
          }
        },
      },
    ]);
  };


  const openViewer = (category: GalleryCategory, index: number) => {
    const images = category.images.map((img) => ({
      uri: img.path.large || img.path.small,
    }));
    setViewerImages(images);
    setViewerIndex(index);
    setViewerVisible(true);
  };


  if (categories.length === 0 && !property) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25C5D1" />
      </View>
    );
  }


  if (categories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="images-outline" size={60} color="#ccc" />
        <Text style={styles.emptyText}>Galeri kategorisi bulunamadı</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          Lütfen logolu resimler eklemeyin. Aksi halde ilanınız pasif edilecektir
        </Text>
      </View>


      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {categories.map((category) => (
          <View key={category.id} style={styles.categorySection}>

            <Text style={styles.categoryTitle}>{category.title}</Text>


            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imagesContainer}
            >
     
              {category.images.map((image, index) => (
                <TouchableOpacity
                  key={image.id}
                  style={styles.imageWrapper}
                  onPress={() => openViewer(category, index)}
                  onLongPress={() => handleDeleteImage(image.id)}
                >
                  <Image source={{ uri: image.path.small }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteImage(image.id)}
                    disabled={deleting}
                  >
                    <Ionicons name="close-circle" size={24} color="#dc3545" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}

       
              <TouchableOpacity
                style={styles.addImageBox}
                onPress={() => handlePickImage(category.id)}
                disabled={uploading}
              >
                {uploading && uploadingCategoryId === category.id ? (
                  <ActivityIndicator size="small" color="#25C5D1" />
                ) : (
                  <>
                    <Ionicons name="add" size={32} color="#999" />
                    <Text style={styles.addImageText}>Fotoğraf{"\n"}Yükleyin</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>


      <ImageViewing
        images={viewerImages}
        imageIndex={viewerIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
    marginTop: 10,
  },
  warningBox: {
    backgroundColor: "#FFF9E6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 15,
    borderRadius: 8,
  },
  warningText: {
    color: "#333",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  scrollView: {
    flex: 1,
    marginTop: 10,
  },
  categorySection: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#25C5D1",
    marginBottom: 12,
  },
  imagesContainer: {
    flexDirection: "row",
    gap: 10,
  },
  imageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
  },
  deleteBtn: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  addImageBox: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  addImageText: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
});

export default GalleryScreen;