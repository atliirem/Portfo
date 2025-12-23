
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

const TextInputNormal: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder = '',
  containerStyle,
  isPassword = true,
  ...rest
}) => {
 

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B8C2CC"
     
        style={styles.input}
        autoCapitalize="none"
        {...rest}
      />

      {isPassword ? (
        <Pressable
          accessibilityRole="button"
         
          hitSlop={12}
          style={styles.iconBtn}
        >
          
        </Pressable>
      ) : null}
    </View>
  );
};

export default TextInputNormal;

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