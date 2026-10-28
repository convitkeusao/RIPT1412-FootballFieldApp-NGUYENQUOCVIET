import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AppButton from './AppButton';
import AppInput from './AppInput';
import colors from '../theme/colors';
import type { BookingData, FieldData } from '../types';
import { calculateBookingPrice } from '../utils/bookingUtils';
import { formatCurrency } from '../utils/formatters';
import { validateBookingData } from '../utils/validation';

interface BookingForm {
  customerName: string;
  phone: string;
  date: string;
  startHour: number;
  hours: number;
}

interface BookingModalProps {
  visible: boolean;
  field: FieldData | null;
  bookings: BookingData[];
  onClose: () => void;
  onSubmit: (booking: BookingData) => void;
  loading?: boolean;
}

const emptyForm: BookingForm = {
  customerName: '',
  phone: '',
  date: '',
  startHour: 17,
  hours: 1,
};

export default function BookingModal({
  visible,
  field,
  bookings,
  onClose,
  onSubmit,
  loading = false,
}: BookingModalProps) {
  const [form, setForm] = useState<BookingForm>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) {
      setForm(emptyForm);
      setErrors({});
    }
  }, [visible]);

  const totalPrice = useMemo(() => calculateBookingPrice(field, form.hours), [field, form.hours]);

  const handleChange = <K extends keyof BookingForm>(key: K, value: BookingForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined as never }));
  };

  const handleSubmit = () => {
    const nextBooking = {
      ...form,
      id: `booking-temp`,
      fieldId: field?.id ?? '',
      date: form.date,
      startHour: Number(form.startHour),
      hours: Number(form.hours),
    } as BookingData;

    const validation = validateBookingData(nextBooking, [field as FieldData].filter(Boolean), bookings, null);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(nextBooking);
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <Text style={styles.title}>Đặt sân {field?.name || ''}</Text>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <AppInput
              label="Tên khách hàng"
              value={form.customerName}
              onChangeText={value => handleChange('customerName', value)}
              placeholder="Nguyễn Văn A"
              error={errors.customerName}
            />

            <AppInput
              label="Số điện thoại"
              value={form.phone}
              onChangeText={value => handleChange('phone', value)}
              placeholder="0912345678"
              keyboardType="phone-pad"
              maxLength={10}
              error={errors.phone}
            />

            <AppInput
              label="Ngày đặt"
              value={form.date}
              onChangeText={value => handleChange('date', value)}
              placeholder="28/10/2026"
              error={errors.date}
            />

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Giờ bắt đầu</Text>
                <View style={styles.pickerRow}>
                  <Pressable
                    onPress={() => handleChange('startHour', Math.max(6, Number(form.startHour) - 1))}
                    style={styles.stepButton}
                  >
                    <Text style={styles.stepText}>-</Text>
                  </Pressable>
                  <Text style={styles.valueText}>{form.startHour}:00</Text>
                  <Pressable
                    onPress={() => handleChange('startHour', Math.min(22, Number(form.startHour) + 1))}
                    style={styles.stepButton}
                  >
                    <Text style={styles.stepText}>+</Text>
                  </Pressable>
                </View>
                {errors.startHour ? <Text style={styles.errorText}>{errors.startHour}</Text> : null}
              </View>

              <View style={styles.half}>
                <Text style={styles.label}>Số giờ thuê</Text>
                <View style={styles.pickerRow}>
                  <Pressable
                    onPress={() => handleChange('hours', Math.max(1, Number(form.hours) - 1))}
                    style={styles.stepButton}
                  >
                    <Text style={styles.stepText}>-</Text>
                  </Pressable>
                  <Text style={styles.valueText}>{form.hours}</Text>
                  <Pressable
                    onPress={() => handleChange('hours', Math.min(3, Number(form.hours) + 1))}
                    style={styles.stepButton}
                  >
                    <Text style={styles.stepText}>+</Text>
                  </Pressable>
                </View>
                {errors.hours ? <Text style={styles.errorText}>{errors.hours}</Text> : null}
              </View>
            </View>

            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Thành tiền</Text>
              <Text style={styles.totalValue}>{formatCurrency(totalPrice)}</Text>
            </View>

            {errors.conflict || errors.fieldId ? (
              <Text style={styles.errorText}>{errors.conflict || errors.fieldId}</Text>
            ) : null}
          </ScrollView>

          <View style={styles.footer}>
            <AppButton label="Hủy" variant="secondary" onPress={onClose} style={styles.cancelButton} />
            <AppButton
              label={loading ? 'Đang lưu...' : 'Xác nhận'}
              onPress={handleSubmit}
              disabled={loading}
              style={styles.confirmButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    maxHeight: '90%',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 18,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    columnGap: 12,
  },
  half: {
    flex: 1,
  },
  label: {
    color: colors.text,
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 14,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    minHeight: 48,
  },
  stepButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    color: colors.lightText,
    fontWeight: '700',
    fontSize: 18,
  },
  valueText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  totalBox: {
    marginTop: 18,
    backgroundColor: '#E9F8F0',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: colors.text,
    fontWeight: '700',
  },
  totalValue: {
    color: colors.brandDark,
    fontWeight: '800',
    fontSize: 17,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    columnGap: 10,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
});
