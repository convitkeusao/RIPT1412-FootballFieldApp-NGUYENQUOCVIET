import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
import type { BookingData, FieldData } from '../types';
import { formatCurrency } from '../utils/formatters';
import { calculateBookingPrice } from '../utils/bookingUtils';

interface BookingCardProps {
  booking: BookingData;
  field: FieldData;
  onCancel: () => void;
}

export default function BookingCard({ booking, field, onCancel }: BookingCardProps) {
  const totalPrice = calculateBookingPrice(field, booking.hours);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.customerName}>{booking.customerName}</Text>
        <Text style={styles.phone}>{booking.phone}</Text>
      </View>

      <Text style={styles.detail}>Ngày: {booking.date}</Text>
      <Text style={styles.detail}>Giờ: {booking.startHour}:00 - {booking.startHour + booking.hours}:00</Text>
      <Text style={styles.detail}>Thời lượng: {booking.hours} giờ</Text>
      <Text style={styles.price}>Tổng: {formatCurrency(totalPrice)}</Text>

      <Pressable onPress={onCancel} style={styles.cancelButton}>
        <Text style={styles.cancelText}>Hủy</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  customerName: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
  phone: {
    color: colors.textMuted,
    fontSize: 13,
  },
  detail: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 6,
  },
  price: {
    color: colors.brandDark,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
  },
  cancelButton: {
    alignSelf: 'flex-end',
    marginTop: 14,
    backgroundColor: colors.danger,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelText: {
    color: colors.lightText,
    fontWeight: '600',
  },
});
