import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import React from "react";
import { updatePropertyStatus } from "../../../../api";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";



interface TaslakInfoProps {
  propertyId: number;
}

const TaslakInfo: React.FC<TaslakInfoProps> = ({ propertyId }) => {
  const dispatch = useAppDispatch();
  const { property, loading } = useAppSelector((state) => state.properties);

   if (!property || loading) {
    return null;
  }


  const currentStatus = property?.status || "draft";


  const handlePublish = () => {
    Alert.alert(
      "İlanı Yayınla",
      "İlanınızı yayınlamak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Yayınla",
          onPress: async () => {
            try {
              await dispatch(updatePropertyStatus({ id: propertyId, status: "published" })).unwrap();
              Alert.alert("Başarılı", "İlanınız yayınlandı.");
            } catch (error: any) {
              Alert.alert("Hata", error || "İlan yayınlanamadı.");
            }
          },
        },
      ]
    );
  };

  // const handleDeactivate = () => {
  //   Alert.alert(
  //     "İlanı Pasife Al",
  //     "İlanınızı pasife almak istediğinize emin misiniz?",
  //     [
  //       { text: "İptal", style: "cancel" },
  //       {
  //         text: "Pasife Al",
  //         style: "destructive",
  //         onPress: async () => {
  //           try {
  //             await dispatch(updatePropertyStatus({ id: propertyId, status: "draft" })).unwrap();
  //             Alert.alert("Başarılı", "İlanınız pasife alındı.");
  //           } catch (error: any) {
  //             Alert.alert("Hata", error || "İşlem başarısız.");
  //           }
  //         },
  //       },
  //     ]
  //   );
  // };

  if (currentStatus === "draft") {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>
          Bu ilan şu anda taslak durumunda. İlan bilgilerinizi tamamladıktan sonra
          yayınlayabilirsiniz.
        </Text>

        <TouchableOpacity
          style={styles.publishButton}
          onPress={handlePublish}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Şimdi Yayınla</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }


  if (currentStatus === "sold") {
    return (
      <View style={[styles.container, styles.soldContainer]}>
        <Text style={styles.infoText}>
          Bu ilan satıldı olarak işaretlendi.
        </Text>
      </View>
    );
  }


  return null;
};

export default TaslakInfo;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff4cd",
    justifyContent: "center",
    alignItems: "center",
    margin: 16,
  
    borderRadius: 8,
  },
  publishedContainer: {
    backgroundColor: "#d4edda",
  },
  soldContainer: {
    backgroundColor: "#f8d7da",
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 20,
  },
  publishButton: {
    width: "100%",
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#fec964",
  },
  deactivateButton: {
    width: "100%",
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#6c757d",
  },
  buttonText: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 15,
  },
});