import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import colors from '../theme/colors';

interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}: AppButtonProps) {
  const isDanger = variant === 'danger';
  const isSecondary = variant === 'secondary';

  const buttonStyle: StyleProp<ViewStyle>[] = [
    styles.button,
    isDanger && styles.danger,
    isSecondary && styles.secondary,
    !isDanger && !isSecondary && styles.primary,
    disabled && styles.disabled,
    style,
  ];

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        buttonStyle,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primary: {
    backgroundColor: colors.brand,
  },
  secondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    color: colors.lightText,
    fontSize: 15,
    fontWeight: '700',
  },
});
