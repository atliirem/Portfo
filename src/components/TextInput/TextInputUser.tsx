import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle | ViewStyle[];
  secureTextEntry?: boolean;
  isModal?: boolean;
  modalIconName?: string;
  error?: boolean;  
} & Omit<TextInputProps, "onChangeText" | "value" | "placeholder">;

const TextInputUser: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder = "",
  containerStyle,
  secureTextEntry = false,
  isModal = false,
  modalIconName = "chevron-forward-outline",
  error = false,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View
      style={[
        styles.container,
        containerStyle,
        error ? styles.errorBorder : null,  
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B8C2CC"
        style={styles.input}
        autoCapitalize="none"
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        {...rest}
      />

      {isModal && (
        <Ionicons
          name={modalIconName}
          size={22}
          color="#94A3B8"
          style={{ marginLeft: 8 }}
        />
      )}

      {secureTextEntry && (
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.iconBtn}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#94A3B8"
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
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E9EE",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#0F172A",
  },
  iconBtn: {
    marginLeft: 8,
  },
  errorBorder: {
    borderColor: "red",
    borderWidth: 2,
  },
});
