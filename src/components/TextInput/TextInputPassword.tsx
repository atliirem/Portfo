import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  Pressable,
  ViewStyle,
} from 'react-native';


type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;

  isPassword?: boolean;
} & Omit<TextInputProps, 'onChangeText' | 'value' | 'placeholder'>;

const PasswordTextInput: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder = '',
  containerStyle,
  isPassword = true,
  ...rest
}) => {
  const [hidden, setHidden] = useState<boolean>(isPassword);

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B8C2CC"
        secureTextEntry={isPassword ? hidden : false}
        style={styles.input}
        autoCapitalize="none"
        {...rest}
      />

      {isPassword ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => setHidden((p) => !p)}
          hitSlop={12}
          style={styles.iconBtn}
        >
          <Ionicons
            name={hidden ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#98A2B3"
          />
        </Pressable>
      ) : null}
    </View>
  );
};

export default PasswordTextInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 20,
    borderColor: '#bec0c4ff',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
  },
  iconBtn: {
    marginLeft: 8,
  },
});