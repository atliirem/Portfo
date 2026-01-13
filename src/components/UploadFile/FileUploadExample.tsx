// src/components/FilePicker/FilePicker.tsx

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
  buttonStyle?: object;
  textStyle?: object;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  showRemoveButton?: boolean;
  showFileSize?: boolean;
  maxFileSize?: number;
  label?: string;
  required?: boolean;
}

const FilePicker: React.FC<FilePickerProps> = ({
  onFileSelect,
  value,
  placeholder = "Dosya Seçin",
  allowedTypes = ["pdf", "image"],
  containerStyle,
  buttonStyle,
  textStyle,
  disabled = false,
  error = false,
  errorMessage,
  showRemoveButton = true,
  showFileSize = true,
  maxFileSize = 10,
  label,
  required = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "";

    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Dosya tipini kontrol et
  const isAllowedType = (mimeType: string, fileName: string): boolean => {
    if (allowedTypes.includes("all")) return true;

    const type = mimeType?.toLowerCase() || "";
    const name = fileName?.toLowerCase() || "";

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
    if (disabled || isLoading) return;

    try {
      setIsLoading(true);

      // ✅ Tüm dosyaları kabul et, sonra filtrele
      const result = await pick();

      console.log("Pick result:", result);

      let file: any = null;

      if (Array.isArray(result) && result.length > 0) {
        file = result[0];
      } else if (result && typeof result === "object") {
        file = result;
      }

      console.log("Selected file:", file);

      if (file && file.uri) {
        const fileName = file.name || file.fileName || "";
        const fileType = file.type || file.mimeType || "";

        // Dosya tipi kontrolü
        if (!isAllowedType(fileType, fileName)) {
          Alert.alert(
            "Geçersiz Dosya Tipi",
            `Sadece ${allowedTypes.join(", ").toUpperCase()} dosyaları yükleyebilirsiniz.`
          );
          return;
        }

        // Dosya boyutu kontrolü
        const fileSize = file.size || file.fileSize || 0;
        if (fileSize && maxFileSize) {
          const fileSizeMB = fileSize / (1024 * 1024);
          if (fileSizeMB > maxFileSize) {
            Alert.alert(
              "Dosya Çok Büyük",
              `Maksimum dosya boyutu ${maxFileSize} MB olmalıdır.`
            );
            return;
          }
        }

        const selectedFile: SelectedFile = {
          uri: file.uri,
          name: fileName || "dosya",
          type: fileType || "application/octet-stream",
          size: fileSize || undefined,
        };

        console.log("Final selectedFile:", selectedFile);
        onFileSelect(selectedFile);
      }
    } catch (err: any) {
      console.log("Pick error:", err);

      const msg = err?.message?.toLowerCase() || "";
      const code = err?.code?.toLowerCase() || "";

      if (msg.includes("cancel") || code.includes("cancel")) {
        console.log("Dosya seçimi iptal edildi");
      } else {
        console.error("Dosya seçme hatası:", err);
        Alert.alert("Hata", "Dosya seçilirken bir hata oluştu.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    Alert.alert(
      "Dosyayı Kaldır",
      "Seçili dosyayı kaldırmak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Kaldır",
          style: "destructive",
          onPress: () => onFileSelect(null),
        },
      ]
    );
  };

  const getFileIcon = (): string => {
    if (!value?.type) return "📄";

    if (value.type.includes("pdf")) return "📕";
    if (value.type.includes("image")) return "🖼️";
    if (value.type.includes("doc") || value.type.includes("word")) return "📘";
    return "📄";
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        onPress={handlePick}
        disabled={disabled || isLoading}
        style={[
          styles.pickerButton,
          buttonStyle,
          error && styles.errorBorder,
          disabled && styles.disabled,
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.buttonContent}>
          {isLoading ? (
            <ActivityIndicator color="#25C5D1" size="small" />
          ) : value ? (
            <>
              <Text style={styles.fileIcon}>{getFileIcon()}</Text>
              <View style={styles.fileInfo}>
                <Text style={[styles.fileName, textStyle]} numberOfLines={1}>
                  {value.name}
                </Text>
                {showFileSize && value.size && (
                  <Text style={styles.fileSize}>
                    {formatFileSize(value.size)}
                  </Text>
                )}
              </View>
            </>
          ) : (
            <>
              <Text style={styles.uploadIcon}>📁</Text>
              <Text style={[styles.placeholder, textStyle]}>{placeholder}</Text>
            </>
          )}

          <Text style={styles.arrow}>▼</Text>
        </View>
      </TouchableOpacity>

      {error && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      {value && showRemoveButton && !disabled && (
        <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>✕ Dosyayı Kaldır</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.allowedTypes}>
        İzin verilen: {allowedTypes.join(", ").toUpperCase()} (Maks: {maxFileSize} MB)
      </Text>
    </View>
  );
};

export default FilePicker;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  required: {
    color: "#e74c3c",
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderStyle: "dashed",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  uploadIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  fileIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  fileSize: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  placeholder: {
    fontSize: 14,
    color: "#999",
    flex: 1,
  },
  arrow: {
    fontSize: 12,
    color: "#999",
    marginLeft: 8,
  },
  errorBorder: {
    borderColor: "#e74c3c",
    borderWidth: 1.5,
  },
  disabled: {
    backgroundColor: "#f5f5f5",
    opacity: 0.7,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 4,
  },
  removeButton: {
    marginTop: 8,
    paddingVertical: 6,
    alignItems: "flex-start",
  },
  removeButtonText: {
    color: "#e74c3c",
    fontSize: 13,
    fontWeight: "500",
  },
  allowedTypes: {
    fontSize: 11,
    color: "#aaa",
    marginTop: 6,
  },
});