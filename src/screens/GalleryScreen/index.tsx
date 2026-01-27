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
  Platform,
  Linking,
  Modal,
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import Ionicons from "@react-native-vector-icons/ionicons";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { useAppSelector, useAppDispatch } from "../../redux/Hooks";
import { getPropertyById } from "../../../api/CreateThunk";
import {
  deleteGalleryImage,
  GalleryCategory,
  setGalleryCategories,
  setCoverImage,
  uploadGalleryImage,
  uploadCoverImage,
} from "../../redux/Slice/uploadPhotoSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../navigation/Navbar/HomeStack";

const { width } = Dimensions.get("window");
const IMAGE_SIZE = width * 0.28;
const COVER_IMAGE_SIZE = width - 30;

// Default placeholder image
const DEFAULT_COVER_IMAGE = "https://via.placeholder.com/600x400/f5f5f5/999999?text=Fotoğraf+Ekleyin";

type NavigationProps = NativeStackScreenProps<HomeStackParamList, "GalleryScreen">;

interface DirectProps {
  propertyId: number;
  onImagesChange?: (hasImages: boolean, totalCount?: number) => void;
}

type Props = NavigationProps | DirectProps;

const GalleryScreen: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();

  const propertyId = 'propertyId' in props
    ? props.propertyId
    : props.route.params.propertyId;

  const onImagesChange = 'onImagesChange' in props
    ? props.onImagesChange
    : undefined;

  const { property } = useAppSelector((state) => state.properties);
  const { categories, coverImage, uploading, uploadingCover, deleting } = useAppSelector((state) => state.gallery);

  const [uploadingCategoryId, setUploadingCategoryId] = useState<number | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerImages, setViewerImages] = useState<{ uri: string }[]>([]);
  const [coverModalVisible, setCoverModalVisible] = useState(false);
  const [isPropertyLoaded, setIsPropertyLoaded] = useState(false);

  const otherCategories = categories.filter(
    (c) => !c.title.toLowerCase().includes("kapak") &&
      !c.title.toLowerCase().includes("cover")
  );

  // Toplam resim sayısını hesapla
  const totalImageCount = categories.reduce((sum, cat) => sum + cat.images.length, 0);
  const hasImages = totalImageCount > 0 || !!coverImage;

  useEffect(() => {
    if (propertyId && (!property || property.id !== propertyId)) {
      dispatch(getPropertyById(propertyId))
        .then(() => setIsPropertyLoaded(true))
        .catch(() => setIsPropertyLoaded(true));
    } else if (property) {
      setIsPropertyLoaded(true);
    }
  }, [propertyId, dispatch]);

  useEffect(() => {
    if (property?.galleries) {
      dispatch(setGalleryCategories(property.galleries));
    }
    if (property?.cover) {
      dispatch(setCoverImage(property.cover));
    }
  }, [property, dispatch]);

  // Resim değişikliklerini parent'a bildir
  useEffect(() => {
    if (onImagesChange) {
      onImagesChange(hasImages, totalImageCount);
    }
  }, [hasImages, totalImageCount, coverImage, onImagesChange]);

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const handleCameraError = (errorCode: string, errorMessage?: string) => {
    switch (errorCode) {
      case 'camera_unavailable':
        Alert.alert("Hata", "Kamera kullanılamıyor.");
        break;
      case 'permission':
        Alert.alert(
          "Kamera İzni Gerekli",
          "Kamera kullanabilmek için izin vermeniz gerekiyor.",
          [
            { text: "İptal", style: "cancel" },
            { text: "Ayarlar", onPress: openSettings },
          ]
        );
        break;
      default:
        Alert.alert("Hata", errorMessage || "Kamera açılamadı.");
        break;
    }
  };

  const handleGalleryError = (errorCode: string, errorMessage?: string) => {
    if (errorCode === 'permission') {
      Alert.alert(
        "Galeri İzni Gerekli",
        "Fotoğraflara erişebilmek için izin vermeniz gerekiyor.",
        [
          { text: "İptal", style: "cancel" },
          { text: "Ayarlar", onPress: openSettings },
        ]
      );
    } else {
      Alert.alert("Hata", errorMessage || "Galeri açılamadı.");
    }
  };

  const handlePickImage = (categoryId: number) => {
    Alert.alert("Fotoğraf Ekle", "Nereden eklemek istersiniz?", [
      { text: "İptal", style: "cancel" },
      { text: "Galeri", onPress: () => openGallery(categoryId) },
      { text: "Kamera", onPress: () => openCamera(categoryId) },
    ]);
  };

  const handlePickCoverImage = () => {
    setCoverModalVisible(false);
    Alert.alert("Kapak Fotoğrafı", "Nereden eklemek istersiniz?", [
      { text: "İptal", style: "cancel" },
      { text: "Galeri", onPress: openCoverGallery },
      { text: "Kamera", onPress: openCoverCamera },
    ]);
  };

  const openGallery = (categoryId: number) => {
    launchImageLibrary(
      { mediaType: "photo", selectionLimit: 10, quality: 0.8 },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          handleGalleryError(response.errorCode, response.errorMessage);
          return;
        }
        if (response.assets?.length) {
          uploadImages(response.assets, categoryId);
        }
      }
    );
  };

  const openCamera = (categoryId: number) => {
    launchCamera(
      { mediaType: "photo", quality: 0.8, cameraType: 'back' },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          handleCameraError(response.errorCode, response.errorMessage);
          return;
        }
        if (response.assets?.length) {
          uploadImages(response.assets, categoryId);
        }
      }
    );
  };

  const openCoverGallery = () => {
    launchImageLibrary(
      { mediaType: "photo", selectionLimit: 1, quality: 0.8 },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          handleGalleryError(response.errorCode, response.errorMessage);
          return;
        }
        if (response.assets?.length) {
          uploadCover(response.assets[0]);
        }
      }
    );
  };

  const openCoverCamera = () => {
    launchCamera(
      { mediaType: "photo", quality: 0.8, cameraType: 'back' },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          handleCameraError(response.errorCode, response.errorMessage);
          return;
        }
        if (response.assets?.length) {
          uploadCover(response.assets[0]);
        }
      }
    );
  };

  const uploadImages = async (assets: any[], categoryId: number) => {
    setUploadingCategoryId(categoryId);
    try {
      for (const asset of assets) {
        await dispatch(uploadGalleryImage({ propertyId, categoryId, asset })).unwrap();
      }
      Alert.alert("Başarılı", `${assets.length} fotoğraf yüklendi.`);
    } catch (error: any) {
      Alert.alert("Hata", error || "Yüklenemedi.");
    } finally {
      setUploadingCategoryId(null);
    }
  };

  const uploadCover = async (asset: any) => {
    try {
      await dispatch(uploadCoverImage({ propertyId, asset })).unwrap();
      Alert.alert("Başarılı", "Kapak fotoğrafı güncellendi.");
    } catch (error: any) {
      Alert.alert("Hata", error || "Kapak fotoğrafı yüklenemedi.");
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

  const openCoverViewer = () => {
    if (coverImage) {
      setViewerImages([{ uri: coverImage }]);
      setViewerIndex(0);
      setViewerVisible(true);
    }
    setCoverModalVisible(false);
  };

  const renderCoverModal = () => (
    <Modal
      visible={coverModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setCoverModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setCoverModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Kapak Fotoğrafı</Text>

          {coverImage && (
            <TouchableOpacity style={styles.modalOption1} onPress={openCoverViewer}>
              <Text style={styles.modalOptionText}>Görüntüle</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.modalOption} onPress={handlePickCoverImage}>
            <Text style={styles.modalOptionText}>
              {coverImage ? "Güncelle" : "Fotoğraf Ekle"}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Property yüklenene kadar hiçbir şey gösterme
  if (!isPropertyLoaded) {
    return null;
  }

  // Kategoriler boşsa ve property yoksa loading göster
  if (categories.length === 0 && !property) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25C5D1" />
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
        {/* Kapak Fotoğrafı */}
        <View style={styles.coverSection}>
          <Text style={styles.sectionTitle}>Kapak Fotoğrafı</Text>
          <TouchableOpacity
            style={styles.coverImageWrapper}
            onPress={() => setCoverModalVisible(true)}
            disabled={uploadingCover}
          >
            {uploadingCover ? (
              <View style={styles.coverLoading}>
                <ActivityIndicator size="large" color="#25C5D1" />
                <Text style={styles.coverLoadingText}>Yükleniyor...</Text>
              </View>
            ) : (
              <Image 
                source={{ uri: coverImage || DEFAULT_COVER_IMAGE }} 
                style={styles.coverImage} 
              />
            )}
            {!coverImage && !uploadingCover && (
              <View style={styles.coverOverlay}>
                <Ionicons name="camera-outline" size={24} color="#fff" />
                <Text style={styles.coverOverlayText}>Fotoğraf Ekle</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Diğer Kategoriler */}
        {otherCategories.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.title}</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imagesContainer}
            >
              {category.images.map((image, index) => (
                <View key={image.id} style={styles.imageWrapper}>
                  <TouchableOpacity onPress={() => openViewer(category, index)}>
                    <Image source={{ uri: image.path.small }} style={styles.image} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteImage(image.id)}
                    disabled={deleting}
                  >
                    <Ionicons name="close-circle" size={24} color="#dc3545" />
                  </TouchableOpacity>
                </View>
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

      {renderCoverModal()}

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
  warningBox: {
    backgroundColor: "#FFF9E6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 15,
    borderRadius: 8,
    marginTop: -30,
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
  coverSection: {
    paddingHorizontal: 15,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#25C5D1",
    marginBottom: 12,
  },
  coverImageWrapper: {
    width: COVER_IMAGE_SIZE,
    height: COVER_IMAGE_SIZE * 0.6,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 8,
  },
  coverOverlayText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  coverLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  coverLoadingText: {
    color: "#25C5D1",
    marginTop: 10,
    fontSize: 14,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 11,
    width: width * 0.9,
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2cbecc",
    textAlign: "center",
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#59e0ec",
    marginBottom: 10,
    gap: 12,
    justifyContent: 'center',
  },
  modalOption1: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#fdcb69",
    marginBottom: 10,
    gap: 12,
    justifyContent: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
    justifyContent: 'center',
    textAlign: 'center'
  },
});

export default GalleryScreen;