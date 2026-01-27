import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import FileViewer from "react-native-file-viewer";

export type SelectedFile = {
  uri: string;
  name: string;
  type: string;
  size?: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  file: SelectedFile | null;
};

const SelectedFilesModal: React.FC<Props> = ({ visible, onClose, file }) => {
  const [opening, setOpening] = useState(false);

  const openFile = async () => {
    if (!file?.uri) return;

    try {
      setOpening(true);

      const path = file.uri.startsWith("file://")
        ? file.uri.replace("file://", "")
        : file.uri;

      await FileViewer.open(path, {
        showOpenWithDialog: true,
        displayName: file.name,
      });
    } catch (e: any) {
      Alert.alert("Hata", e?.message || "Dosya açılamadı");
    } finally {
      setOpening(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.center}>
        <View style={styles.card}>
          <Text style={styles.title}>Seçili Dosyalar</Text>

          <View style={styles.row}>
            <Text style={styles.fileName} numberOfLines={1}>
              {file?.name || "-"}
            </Text>

            <TouchableOpacity
              style={[styles.viewBtn, (!file?.uri || opening) && styles.disabled]}
              onPress={openFile}
              disabled={!file?.uri || opening}
              activeOpacity={0.85}
            >
              {opening ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.viewBtnText}>Görüntüle</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.closeBtnText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SelectedFilesModal;

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 18 },
  card: { width: "100%", maxWidth: 520, backgroundColor: "#fff", borderRadius: 14, padding: 18 },
  title: { fontSize: 2, fontWeight: "800", marginBottom: 14, color: "#111827" },
  row: { flexDirection: "row", alignItems: "center" },
  fileName: { flex: 1, fontSize: 18, fontWeight: "700", color: "#111827", marginRight: 12 },
  viewBtn: { backgroundColor: "#19A7B6", paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  viewBtnText: { color: "#fff", fontWeight: "800" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 16 },
  closeBtn: { alignSelf: "center", backgroundColor: "#19A7B6", paddingHorizontal: 36, paddingVertical: 12, borderRadius: 12 },
  closeBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  disabled: { opacity: 0.55 },
});
