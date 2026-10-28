import React, { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import BookingCard from '../components/BookingCard';
import BookingModal from '../components/BookingModal';
import colors from '../theme/colors';
import { useAppContext } from '../context/AppContext';
import type { BookingData, FieldData } from '../types';
import { formatCurrency } from '../utils/formatters';

interface FieldDetailScreenProps {
  route: {
    params?: {
      fieldId?: string;
    };
  };
  navigation: {
    goBack: () => void;
  };
}

export default function FieldDetailScreen({ route, navigation }: FieldDetailScreenProps) {
  const { fields, bookings, addBooking, cancelBooking } = useAppContext();
  const { fieldId } = route.params || {};
  const field = fields.find((item: FieldData) => item.id === fieldId);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const fieldBookings = useMemo(
    () => bookings.filter((booking: BookingData) => booking.fieldId === fieldId),
    [bookings, fieldId],
  );

  if (!field) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Sân không tồn tại.</Text>
        </View>
      </View>
    );
  }

  const handleAddBooking = async (booking: BookingData) => {
    if (field.status !== 'Hoạt động') {
      Alert.alert('Không thể đặt sân', 'Sân đang ở trạng thái bảo trì.');
      return;
    }

    setSaving(true);
    const success = await addBooking({
      ...booking,
      id: `booking-${Date.now()}`,
      fieldId: field.id,
    });
    setSaving(false);

    if (success) {
      setModalVisible(false);
      Alert.alert('Thành công', 'Lượt đặt sân đã được lưu.');
    }
  };

  const handleCancelBooking = (booking: BookingData) => {
    Alert.alert('Xác nhận hủy', `Bạn có muốn hủy booking của ${booking.customerName}?`, [
      { text: 'Không', style: 'cancel' },
      {
        text: 'Hủy',
        style: 'destructive',
        onPress: async () => {
          const success = await cancelBooking(booking.id);
          if (success) {
            Alert.alert('Đã hủy', 'Lượt đặt đã được hủy.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <AppButton
          label="Quay lại"
          variant="secondary"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          textStyle={{ color: colors.text }}
        />
      </View>

      <View style={styles.headerCard}>
        <Text style={styles.fieldName}>{field.name}</Text>

        <View style={styles.headerRow}>
          <Text style={styles.metaLabel}>Loại:</Text>
          <Text style={styles.metaValue}>{field.type}</Text>
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.metaLabel}>Giá:</Text>
          <Text style={styles.metaValue}>{formatCurrency(field.pricePerHour)}</Text>
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.metaLabel}>Trạng thái:</Text>
          <Text style={[styles.statusText, { color: field.status === 'Hoạt động' ? colors.success : colors.warning }]}>
            {field.status}
          </Text>
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.metaLabel}>Số lượt đặt:</Text>
          <Text style={styles.metaValue}>{fieldBookings.length}</Text>
        </View>
      </View>

      <AppButton
        label="Đặt sân"
        onPress={() => setModalVisible(true)}
        disabled={field.status !== 'Hoạt động'}
        style={styles.bookingButton}
      />

      <Text style={styles.sectionTitle}>Danh sách lượt đặt</Text>

      {fieldBookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Chưa có lượt đặt nào cho sân này.</Text>
        </View>
      ) : (
        <FlatList
          data={fieldBookings}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }: { item: BookingData }) => (
            <BookingCard
              booking={item}
              field={field}
              onCancel={() => handleCancelBooking(item)}
            />
          )}
        />
      )}

      <BookingModal
        visible={modalVisible}
        field={field}
        bookings={bookings}
        loading={saving}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddBooking}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    marginRight: 12,
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerCard: {
    backgroundColor: colors.card,
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  fieldName: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  metaValue: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 14,
  },
  bookingButton: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 16,
  },
});
