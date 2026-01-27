import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { pick } from "@react-native-documents/picker";

export interface SelectedFile {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

interface FilePickerProps {
  onFileSelect: (file: SelectedFile | null) => void;
  value?: SelectedFile | null;
  placeholder?: string;
  allowedTypes?: ("pdf" | "image" | "doc" | "all")[];
  containerStyle?: object;
  disabled?: boolean;
  errorText?: string | null;
  label?: string;
  required?: boolean;
  maxFileSize?: number; // MB
  showRemoveButton?: boolean;
}

const FilePicker: React.FC<FilePickerProps> = ({
  onFileSelect,
  value,
  placeholder = "Dosya Seçin",
  allowedTypes = ["pdf", "image"],
  containerStyle,
  disabled = false,
  errorText = null,
  label,
  required = false,
  maxFileSize = 10,
  showRemoveButton = true,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const isAllowedType = (mimeType: string, fileName: string): boolean => {
    if (allowedTypes.includes("all")) return true;

    const type = (mimeType || "").toLowerCase();
    const name = (fileName || "").toLowerCase();

    if (allowedTypes.includes("pdf") && (type.includes("pdf") || name.endsWith(".pdf"))) return true;
    if (allowedTypes.includes("image") && (type.includes("image") || /\.(jpg|jpeg|png|gif|webp|bmp)$/.test(name))) return true;
    if (allowedTypes.includes("doc") && (type.includes("word") || /\.(doc|docx)$/.test(name))) return true;

    return false;
  };

  const handlePick = async () => {
    if (disabled || isLoading) return;

    try {
      setIsLoading(true);
      const result: any = await pick();
      const file = Array.isArray(result) ? result[0] : result;
      if (!file?.uri) return;

      const name = file.name || file.fileName || "dosya";
      const type = file.type || file.mimeType || "application/octet-stream";
      const size = file.size || file.fileSize || 0;

      if (!isAllowedType(type, name)) {
        Alert.alert("Geçersiz Dosya Tipi");
        return;
      }

      if (size && size / (1024 * 1024) > maxFileSize) {
        Alert.alert("Dosya Çok Büyük", `Maksimum ${maxFileSize} MB`);
        return;
      }

      onFileSelect({ uri: file.uri, name, type, size });
    } catch (e: any) {
      const msg = (e?.message || "").toLowerCase();
      if (!msg.includes("cancel")) {
        Alert.alert("Hata", "Dosya seçilirken hata oluştu.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    Alert.alert("Dosyayı Kaldır", "Emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { text: "Kaldır", style: "destructive", onPress: () => onFileSelect(null) },
    ]);
  };

  return (
    <View style={[styles.wrap, containerStyle]}>
      <View
        style={[
          styles.container,
          errorText && styles.errorBorder,
          disabled && styles.disabled,
        ]}
      >
        {label && (
          <View style={styles.labelWrap}>
            <Text style={[styles.label, errorText && styles.labelError]}>
              {label}
              {required && <Text style={styles.required}> *</Text>}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handlePick}
          disabled={disabled || isLoading}
          activeOpacity={0.7}
          style={styles.touch}
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : value ? (
            <Text style={styles.valueText} numberOfLines={1}>
              {value.name}
            </Text>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}
        </TouchableOpacity>
      </View>

      {!!errorText && <Text style={styles.error}>{errorText}</Text>}

     
    </View>
  );
};

export default FilePicker;

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 18,
  },
  container: {
    height: 58,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#C9CDD3",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  disabled: {
    backgroundColor: "#F1F5F9",
  },
  errorBorder: {
    borderColor: "#EF4444",
  },
  labelWrap: {
    position: "absolute",
    left: 12,
    top: -10,
    paddingHorizontal: 6,
    backgroundColor: "#FFFFFF",
    zIndex: 1,
  },
  label: {
    fontSize: 12,
    color: "#c4c4c4",
    fontWeight: "600",
  },
  labelError: {
    color: "#EF4444",
  },
  required: {
    color: "#EF4444",
  },
  touch: {
    height: "100%",
    justifyContent: "center",
  },
  placeholder: {
    fontSize: 16,
    color: "#787878ff",
  },
  valueText: {
    fontSize: 16,
    color: "#0F172A",
  },
  error: {
    marginTop: 6,
    color: "#EF4444",
    fontSize: 12,
  },
  remove: {
    marginTop: 8,
  },
  removeText: {
    color: "#EF4444",
    fontSize: 10,
    fontWeight: "500",
    left: 260
  },
});
