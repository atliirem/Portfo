import React, { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert, ViewStyle, ActivityIndicator } from "react-native";
import { pick } from "@react-native-documents/picker";

export type SelectedFile = {
  uri: string;
  name: string;
  type: string;
  size?: number;
};

type Props = {
  label: string;
  value?: SelectedFile | null;
  onChange: (file: SelectedFile | null) => void;

  allowedTypes?: ("pdf" | "image" | "doc" | "all")[];
  maxFileSize?: number;

  containerStyle?: ViewStyle;
  disabled?: boolean;
  errorText?: string | null;
};

const FileInputRPicker: React.FC<Props> = ({
  label,
  value = null,
  onChange,
  allowedTypes = ["pdf"],
  maxFileSize = 10,
  containerStyle,
  disabled = false,
  errorText = null,
}) => {
  const [loading, setLoading] = useState(false);

  const borderColor = useMemo(() => {
    if (errorText) return "#EF4444";
    return "#C9CDD3";
  }, [errorText]);

  const isAllowedType = (mimeType: string, fileName: string): boolean => {
    if (allowedTypes.includes("all")) return true;

    const type = (mimeType || "").toLowerCase();
    const name = (fileName || "").toLowerCase();

    for (const allowed of allowedTypes) {
      if (allowed === "pdf") {
        if (type.includes("pdf") || name.endsWith(".pdf")) return true;
      }
      if (allowed === "image") {
        if (type.includes("image") || /\.(jpg|jpeg|png|gif|webp|bmp)$/.test(name)) return true;
      }
      if (allowed === "doc") {
        if (type.includes("word") || type.includes("document") || /\.(doc|docx)$/.test(name)) return true;
      }
    }
    return false;
  };

  const handlePick = async () => {
    if (disabled || loading) return;

    try {
      setLoading(true);

      const result = await pick();

      let file: any = null;
      if (Array.isArray(result) && result.length > 0) file = result[0];
      else if (result && typeof result === "object") file = result;

      if (!file?.uri) return;

      const fileName = file.name || file.fileName || "dosya";
      const fileType = file.type || file.mimeType || "application/octet-stream";
      const fileSize = file.size || file.fileSize || 0;

      if (!isAllowedType(fileType, fileName)) {
        Alert.alert("Geçersiz Dosya Tipi", `Sadece ${allowedTypes.join(", ").toUpperCase()} dosyaları yükleyebilirsiniz.`);
        return;
      }

      if (fileSize && maxFileSize) {
        const fileSizeMB = fileSize / (1024 * 1024);
        if (fileSizeMB > maxFileSize) {
          Alert.alert("Dosya Çok Büyük", `Maksimum dosya boyutu ${maxFileSize} MB olmalıdır.`);
          return;
        }
      }

      const selected: SelectedFile = {
        uri: file.uri,
        name: fileName,
        type: fileType,
        size: fileSize || undefined,
      };

      onChange(selected);
    } catch (err: any) {
      const msg = (err?.message || "").toLowerCase();
      const code = (err?.code || "").toLowerCase();
      if (msg.includes("cancel") || code.includes("cancel")) return;
      Alert.alert("Hata", "Dosya seçilirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const valueText = value ? "1 dosya seçildi" : "";

  return (
    <View style={[styles.wrap, containerStyle]}>
      <Pressable
        onPress={handlePick}
        disabled={disabled || loading}
        style={[styles.container, { borderColor, opacity: disabled ? 0.6 : 1 }]}
      >
        <View style={styles.labelWrap}>
          <Text style={[styles.label, errorText ? styles.labelError : null]}>{label}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color="#19A7B6" />
        ) : (
          <Text style={[styles.value, !valueText ? styles.placeholder : null]}>
            {valueText || "Seç"}
          </Text>
        )}

        <Text style={styles.chev}>›</Text>
      </Pressable>

      {!!errorText ? <Text style={styles.error}>{errorText}</Text> : null}
      {value?.name ? <Text style={styles.fileName} numberOfLines={1}>{value.name}</Text> : null}
    </View>
  );
};

export default FileInputRPicker;

const styles = StyleSheet.create({
  wrap: { marginBottom: 18 },
  container: {
    height: 58,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  labelWrap: {
    position: "absolute",
    left: 12,
    top: -10,
    paddingHorizontal: 6,
    backgroundColor: "#FFFFFF",
  },
  label: { fontSize: 12, color: "#9AA3AE", fontWeight: "600" },
  labelError: { color: "#EF4444" },
  value: { flex: 1, fontSize: 16, color: "#0F172A" },
  placeholder: { color: "#B8C2CC" },
  chev: { fontSize: 26, color: "#9AA3AE", marginLeft: 10, marginBottom: 2 },
  error: { marginTop: 6, color: "#EF4444", fontSize: 12 },
  fileName: { marginTop: 6, fontSize: 12, color: "#6B7280" },
});
