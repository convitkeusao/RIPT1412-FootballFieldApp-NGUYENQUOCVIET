import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
import type { FieldData } from '../types';
import { formatCurrency } from '../utils/formatters';

interface FieldCardProps {
  field: FieldData;
  bookingCount: number;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function FieldCard({ field, bookingCount, onPress, onEdit, onDelete }: FieldCardProps) {
  const isActive = field.status === 'Hoạt động';

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.rowBetween}>
        <View style={styles.headingWrap}>
          <Text style={styles.title}>{field.name}</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: isActive ? '#DDF7E8' : '#FDE7C9' },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: isActive ? colors.success : colors.warning },
              ]}
            >
              {field.status}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Loại:</Text>
        <Text style={styles.metaValue}>{field.type}</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Giá:</Text>
        <Text style={styles.price}>{formatCurrency(field.pricePerHour)}</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Lượt đặt:</Text>
        <Text style={styles.metaValue}>{bookingCount}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={onEdit} style={styles.actionButton}>
          <Text style={styles.actionText}>Sửa</Text>
        </Pressable>
        <Pressable onPress={onDelete} style={[styles.actionButton, styles.deleteButton]}>
          <Text style={styles.actionText}>Xóa</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headingWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  metaValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  price: {
    color: colors.brandDark,
    fontSize: 14,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14,
    columnGap: 8,
  },
  actionButton: {
    backgroundColor: colors.brand,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  actionText: {
    color: colors.lightText,
    fontWeight: '600',
  },
});
