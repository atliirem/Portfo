import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet, ViewStyle } from "react-native";

type Props = {
  label: string;
  valueText?: string; // örn: "1 dosya seçildi"
  onPress: () => void;
  containerStyle?: ViewStyle;
  disabled?: boolean;
  errorText?: string | null;
};

const FileInputR: React.FC<Props> = ({
  label,
  valueText = "",
  onPress,
  containerStyle,
  disabled = false,
  errorText = null,
}) => {
  const borderColor = useMemo(() => {
    if (errorText) return "#EF4444";
    return "#C9CDD3";
  }, [errorText]);

  return (
    <View style={[styles.wrap, containerStyle]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.container,
          { borderColor, opacity: disabled ? 0.6 : 1 },
        ]}
      >
        <View style={styles.labelWrap}>
          <Text style={[styles.label, errorText ? styles.labelError : null]}>
            {label}
          </Text>
        </View>

        <Text style={[styles.value, !valueText ? styles.placeholder : null]}>
          {valueText || "Seç"}
        </Text>

        <Text style={styles.chev}>›</Text>
      </Pressable>

      {!!errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
};

export default FileInputR;

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
});
