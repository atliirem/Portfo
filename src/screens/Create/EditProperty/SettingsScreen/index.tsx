import React from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { Button, Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import {
  getDeleteProperty,
  getCloneProperty,
  getUpdateSold,
  getMyProperties,
  updatePropertyStatus,
} from "../../../../../api";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hooks";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  propertyId: number;
}

const PropertyActions: React.FC<Props> = ({ propertyId }) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

  const { loading, property } = useAppSelector((state) => state.properties);

  const currentStatus = property?.status;
  const isPublished = currentStatus === "published" || currentStatus === "active";

  const handleDeactivate = () => {
    if (!propertyId) return Alert.alert("Hata", "İlan ID bulunamadı.");

    Alert.alert(
      "İlanı Pasife Al",
      "İlanınız yayından kaldırılacak. Devam etmek istiyor musunuz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Pasife Al",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(updatePropertyStatus({ id: propertyId, status: "draft" })).unwrap();
              Alert.alert("Başarılı", "İlan pasife alındı.", [
                { text: "Tamam", onPress: () => dispatch(getMyProperties(1)) },
              ]);
            } catch (error: any) {
              Alert.alert("Hata", error || "İşlem başarısız.");
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    if (!propertyId) return Alert.alert("Hata", "İlan ID bulunamadı.");

    Alert.alert("Emin misiniz?", "Bu ilan kalıcı olarak silinecek.", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(getDeleteProperty(propertyId)).unwrap();
            Alert.alert("Başarılı", "İlan silindi.", [
              {
                text: "Tamam",
                onPress: () => {
                  dispatch(getMyProperties(1));
                  navigation.navigate('PropertiesDetail');
                },
              },
            ]);
          } catch (error: any) {
            Alert.alert("Hata", error || "İlan silinemedi.");
          }
        },
      },
    ]);
  };

  const handleClone = async () => {
    if (!propertyId) return Alert.alert("Hata", "İlan ID bulunamadı.");

    try {
      const currentTitle = property?.title || "İlan";
      await dispatch(
        getCloneProperty({
          id: propertyId,
          title: `${currentTitle} (Kopya)`,
        })
      ).unwrap();

      Alert.alert("Başarılı", "İlan kopyalandı.", [
        { text: "Tamam", onPress: () => dispatch(getMyProperties(1)) },
      ]);
    } catch (error: any) {
      Alert.alert("Hata", error || "İlan kopyalanamadı.");
    }
  };

  const handleSoldUpdate = () => {
    if (!propertyId) return Alert.alert("Hata", "İlan ID bulunamadı.");

    Alert.alert(
      "İlanı Satıldı Olarak İşaretle",
      "Satıldı olarak işaretlenen ilan portföyünüzde kalsın mı?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Kalsın",
          onPress: async () => {
            try {
              await dispatch(getUpdateSold({ id: propertyId, hold: true })).unwrap();
              Alert.alert("Başarılı", "İlan satıldı olarak işaretlendi.", [
                { text: "Tamam", onPress: () => dispatch(getMyProperties(1)) },
              ]);
            } catch (error: any) {
              Alert.alert("Hata", error || "İşlem başarısız.");
            }
          },
        },
        {
          text: "Kalmasın",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(getUpdateSold({ id: propertyId, hold: false })).unwrap();
              Alert.alert("Başarılı", "İlan satıldı ve portföyden kaldırıldı.", [
                {
                  text: "Tamam",
                  onPress: () => {
                    dispatch(getMyProperties(1));
                    navigation.goBack();
                  },
                },
              ]);
            } catch (error: any) {
              Alert.alert("Hata", error || "İşlem başarısız.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          {isPublished && (
            <View style={styles.section}>
              <Text style={styles.header}>İlanı Pasife Al</Text>
              <Text style={styles.info}>
                İlanınızı yayından kaldırın. Daha sonra tekrar yayınlayabilirsiniz.
              </Text>
              <Button
                title="Pasife Al"
                loading={loading}
                buttonStyle={[styles.buttonBase, styles.deactivate]}
                onPress={handleDeactivate}
                titleStyle={styles.titleStyle}
                disabled={!propertyId}
              />
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.header}>İlanı Kopyala</Text>
            <Text style={styles.info}>
              Bu ilanın galeri görselleri dahil tüm özelliklerini kullanarak yeni bir ilan oluşturabilirsiniz.
            </Text>
            <Button
              title="Kopyala"
              loading={loading}
              buttonStyle={[styles.buttonBase, styles.clone]}
              onPress={handleClone}
              titleStyle={styles.titleStyle}
              disabled={!propertyId}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>İlanı Kaldır</Text>
            <Text style={styles.info}>
              Bu ilana ait hareketleri, teklifleri ve benzeri tüm kayıtları tamamen kaldırın.
            </Text>
            <Button
              title="Kaldır"
              loading={loading}
              buttonStyle={[styles.buttonBase, styles.delete]}
              onPress={handleDelete}
              titleStyle={styles.titleStyle}
              disabled={!propertyId}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>İlan Satıldı</Text>
            <Text style={styles.info}>
              İlanı satıldı olarak işaretleyin ve tercihinize göre portföyünüzde kalmasını sağlayın.
            </Text>
            <Button
              title="İlan Satıldı"
              loading={loading}
              buttonStyle={[styles.buttonBase, styles.sold]}
              onPress={handleSoldUpdate}
              titleStyle={styles.titleStyle}
              disabled={!propertyId}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PropertyActions;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 46,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },


  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
  },

  section: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },

  header: {
    fontSize: 16,
    fontWeight: "700",
    color: "#25C5D1",
    marginBottom: 6,
  },
  info: {
    color: "#9a9a9a",
    fontWeight: "600",
    marginBottom: 10,
    lineHeight: 18,
  },

  buttonBase: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignSelf: "flex-start",
    minWidth: 160,
  },
  titleStyle: {
    fontWeight: "700",
    fontSize: 16,
  },

  deactivate: { backgroundColor: "#6c757d" },
  delete: { backgroundColor: "#dc3545" },
  clone: { backgroundColor: "#29c5d3" },
  sold: { backgroundColor: "#1a8755" },
});
