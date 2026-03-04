import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface KitchenProgressProps {
  total: number;
  current: number;
}

export function KitchenProgress({ total, current }: KitchenProgressProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            i < current ? styles.segmentDone : i === current - 1 ? styles.segmentActive : styles.segmentInactive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: Radius.full,
  },
  segmentDone: {
    backgroundColor: Colors.primary,
  },
  segmentActive: {
    backgroundColor: Colors.primary,
  },
  segmentInactive: {
    backgroundColor: Colors.border,
  },
});
