import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import colors from '../theme/colors';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  error,
  multiline = false,
  editable = true,
  maxLength,
}: AppInputProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        editable={editable}
        maxLength={maxLength}
        style={[
          styles.input,
          error ? styles.inputError : null,
          !editable && styles.disabled,
        ]}
        placeholderTextColor={colors.textMuted}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    color: colors.text,
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
  },
  disabled: {
    backgroundColor: colors.background,
    color: colors.textMuted,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
});
