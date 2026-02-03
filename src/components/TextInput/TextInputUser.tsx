import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle | ViewStyle[];
  secureTextEntry?: boolean;
  isModal?: boolean;
  modalIconName?: string;
  error?: boolean;
  multiline?: boolean;

} & Omit<TextInputProps, "onChangeText" | "value" | "placeholder" | "multiline">;

const TextInputUser: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder = "",
  containerStyle,
  secureTextEntry = false,
  isModal = false,
  modalIconName = "chevron-down",
  error = false,
  multiline = false,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View
      style={[
        styles.container,
        multiline && styles.multilineContainer,
        error && styles.errorBorder,
        containerStyle,
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={[
          styles.input,
          multiline && styles.multilineInput,
        ]}
        autoCapitalize="none"
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        {...rest}
      />

      {isModal && (
        <Ionicons
          name={modalIconName}
          size={20}
          color="#666"
          style={styles.modalIcon}
        />
      )}

      {secureTextEntry && (
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.iconBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TextInputUser;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#ffff",
    paddingHorizontal: 16,
  },
  multilineContainer: {
    minHeight: 120,
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    paddingVertical: 0,
  },
  multilineInput: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  modalIcon: {
    marginLeft: 8,
  },
  iconBtn: {
    marginLeft: 8,
    padding: 4,
   
  },
  errorBorder: {
    borderColor: "#FF4444",
    borderWidth: 1.5,
    backgroundColor: "#FFF5F5",
  },
});