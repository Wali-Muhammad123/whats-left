import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

interface TagProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: 'default' | 'accent' | 'outline';
  size?: 'sm' | 'md';
  style?: ViewStyle;
  disabled?: boolean;
}

export function Tag({
  label,
  selected = false,
  onPress,
  variant = 'default',
  size = 'md',
  style,
  disabled = false,
}: TagProps) {
  const Component = onPress ? TouchableOpacity : React.Fragment;
  const componentProps = onPress
    ? { onPress, activeOpacity: 0.75, disabled, style: [styles.base, styles[variant], selected && styles[`${variant}_selected`], styles[`size_${size}`], style] }
    : {};

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.75}
        disabled={disabled}
        style={[
          styles.base,
          styles[variant],
          selected && styles[`${variant}_selected`],
          styles[`size_${size}`],
          style,
        ]}
      >
        <Text
          style={[
            styles.label,
            styles[`label_${variant}`],
            selected && styles[`label_${variant}_selected`],
            styles[`labelSize_${size}`],
          ]}
        >
          {selected ? `✓ ${label}` : label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <React.Fragment>
      <Text
        style={[
          styles.base,
          styles[variant],
          styles[`size_${size}`],
          style as any,
          styles.label,
          styles[`label_${variant}`],
          styles[`labelSize_${size}`],
        ]}
      >
        {label}
      </Text>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: Colors.border,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  default_selected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  accent: {
    backgroundColor: `${Colors.accent}22`,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  accent_selected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  outline_selected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  size_sm: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm + 2,
  },
  size_md: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
  },
  label: {
    fontFamily: Fonts.body,
    fontSize: 13,
  },
  label_default: {
    color: Colors.foundation,
  },
  label_default_selected: {
    color: Colors.white,
    fontFamily: Fonts.bodySemiBold,
  },
  label_accent: {
    color: Colors.foundation,
  },
  label_accent_selected: {
    color: Colors.white,
    fontFamily: Fonts.bodySemiBold,
  },
  label_outline: {
    color: Colors.primary,
  },
  label_outline_selected: {
    color: Colors.white,
    fontFamily: Fonts.bodySemiBold,
  },
  labelSize_sm: {
    fontSize: 12,
  },
  labelSize_md: {
    fontSize: 13,
  },
});
