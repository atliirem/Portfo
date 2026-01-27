import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from "react-native";

type Props = {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
  disabled?: boolean;
  errorText?: string | null;
} & Omit<TextInputProps, "onChangeText" | "value" | "placeholder">;

const TextInputR: React.FC<Props> = ({
  label,
  value,
  onChangeText,
  placeholder = "",
  containerStyle,
  disabled = false,
  errorText = null,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);

  const showLabel = useMemo(() => {
    return Boolean(label);
  }, [label]);

  const borderColor = errorText
    ? "#EF4444"
    : focused
    ? "#C9CDD3"
    : "#C9CDD3";

  return (
    <View style={[styles.wrap, containerStyle]}>
      <View style={[styles.container, { borderColor, backgroundColor: disabled ? '#edebebff' : '#fff' }]}>
        {showLabel ? (
          <View style={styles.labelWrap}>
            <Text style={[styles.label, errorText ? styles.labelError : focused ? styles.labelFocused : null]}>
              {label}
            </Text>
          </View>
        ) : null}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={showLabel ? "" : placeholder}
          placeholderTextColor="#787878ff"
          editable={!disabled}
          style={styles.input}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
      </View>

      {!!errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
};

export default TextInputR;

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 18,
  },
  container: {
    height: 58,
    borderRadius: 3,
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  labelWrap: {
    position: "absolute",
    left: 12,
    top: -10,
    paddingHorizontal: 6,
    backgroundColor: "#FFFFFF",
  },
  label: {
    fontSize: 12,
    color: "#c4c4c4",
    fontWeight: "600",
  },
  labelFocused: {
    color: "#c4c4c4",
  },
  labelError: {
    color: "#EF4444",
  },
  input: {
    padding: 0,
    margin: 0,
    fontSize: 16,
    color: "#0F172A",
  },
  error: {
    marginTop: 6,
    color: "#EF4444",
    fontSize: 12,
  },
});
