import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  getAllSubsrictions,
  getAllPackage,
  getActiveSubscriptionUsage,
} from "../../../api";
import Ionicons from "@react-native-vector-icons/ionicons";
import { ProfileButton } from "../../components/Buttons/profileButton";
import Modal from "react-native-modal";

const MySubscriptionsScreen = () => {
  const dispatch = useAppDispatch();

  const {
    activeSubscriptions,
    packages,
    usage,
    loadingActive,
    loadingPackages,
    loadingUsage,
    error,
  } = useAppSelector((state) => state.subscriptions);

  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [usageVisible, setUsageVisible] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);

  /* 🔹 AKTİF ABONELİKLER + PAKETLER */
  useEffect(() => {
    dispatch(getAllSubsrictions());
    dispatch(getAllPackage());
  }, [dispatch]);

  /* 🔹 SEÇİLİ ABONELİĞİN PAKETİ */
  const selectedPackage = packages.find(
    (p) => p.title === selectedSubscription?.package
  );

  const renderItem = ({ item }: any) => (
    <>
      <View style={styles.card}>
        <View style={styles.status}>
          <Text style={styles.statusValue}>
            {item.is_active ? "Aktif" : "Pasif"}
          </Text>
        </View>

        <Text style={styles.package}>{item.package}</Text>

        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={13} color="#717070" />
          <Text style={styles.date}>{item.finish_at.text}</Text>
          <Text style={styles.remaining}>
            - {item.finish_at.readable}
          </Text>
        </View>

        <ProfileButton
          height={30}
          label="DAHİL OLAN ÖZELLİKLER"
          marginTop={10}
          bg="#038b99"
          color="#fff"
          onPress={() => {
            setSelectedSubscription(item);
            setFeaturesVisible(true);
          }}
        />

        <ProfileButton
          height={30}
          label="KULLANIM ÖZETİ TABLOSU"
          marginTop={10}
          bg="#c4c4c4"
          color="#fff"
          onPress={() => {
            dispatch(getActiveSubscriptionUsage());
            setUsageVisible(true);
          }}
        />
      </View>

      <Text style={styles.payment}>Ödemeler</Text>
    </>
  );

  /* 🔹 LOADING / ERROR */
  if (loadingActive || loadingPackages) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#25C5D1" />
        <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!activeSubscriptions.length) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.empty}>Aktif abonelik bulunamadı.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={activeSubscriptions}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      {/* 🔹 DAHİL OLAN ÖZELLİKLER MODAL */}
      <Modal
        isVisible={featuresVisible}
        onBackdropPress={() => setFeaturesVisible(false)}
        style={styles.bottomModal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {selectedPackage?.title || "Paket Detayları"}
          </Text>

          {Object.values(selectedPackage?.features || {}).map(
            (group: any, index: number) => (
              <View key={index} style={styles.featureGroup}>
                <Text style={styles.groupTitle}>{group.title}</Text>
                {group.features.map((f: string, i: number) => (
                  <Text key={i} style={styles.featureItem}>
                    • {f}
                  </Text>
                ))}
              </View>
            )
          )}

          <ProfileButton
            height={36}
            label="Kapat"
            marginTop={12}
            bg="#c4c4c4"
            color="#fff"
            onPress={() => setFeaturesVisible(false)}
          />
        </View>
      </Modal>

  
      <Modal
        isVisible={usageVisible}
        onBackdropPress={() => setUsageVisible(false)}
        style={styles.bottomModal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Kullanım Özeti</Text>

          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.headerCell]}>Özellik</Text>
            <Text style={[styles.cell, styles.headerCell]}>Limit</Text>
            <Text style={[styles.cell, styles.headerCell]}>Kullanılan</Text>
          </View>

          {loadingUsage ? (
            <ActivityIndicator
              size="small"
              color="#25C5D1"
              style={{ marginTop: 12 }}
            />
          ) : (
            usage.map((u, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.cell}>{u.title}</Text>
                <Text style={styles.cell}>{u.limit}</Text>
                <Text
                  style={[
                    styles.cell,
                    { color: u.can_usage ? "black" : "red" },
                  ]}
                >
                  {u.used}
                </Text>
              </View>
            ))
          )}

          <ProfileButton
            height={36}
            label="Kapat"
            marginTop={12}
            bg="#c4c4c4"
            color="#fff"
            onPress={() => setUsageVisible(false)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MySubscriptionsScreen;



const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff", marginTop: -40 },
  list: { padding: 16 },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  loadingText: { marginTop: 8, color: "#666" },
  error: { color: "red", fontSize: 14 },
  empty: { color: "#999", fontSize: 14 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#eee",
  },

  status: {
    backgroundColor: "#F9C43E",
    width: 60,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  statusValue: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "800",
  },

  package: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginVertical: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 4,
  },

  date: {
    fontSize: 12,
    color: "#8b8989",
    fontWeight: "600",
  },
  remaining: {
    fontSize: 12,
    color: "#25C5D1",
    fontWeight: "600",
  },

  payment: {
    fontSize: 15,
    color: "#27c4d2",
    fontWeight: "700",
    marginTop: 20,
  },

  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },

  featureGroup: { marginBottom: 12 },
  groupTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#25C5D1",
    marginBottom: 4,
  },
  featureItem: {
    fontSize: 13,
    color: "#555",
    marginBottom: 2,
  },

  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 6,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
  cell: {
    flex: 1,
    fontSize: 12,
    color: "black",
  },
  headerCell: {
    fontWeight: "700",
    color: "black",
  },
});
