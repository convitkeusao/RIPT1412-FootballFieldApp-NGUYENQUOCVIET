import React, { useMemo } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import FieldCard from '../components/FieldCard';
import colors from '../theme/colors';
import { useAppContext } from '../context/AppContext';
import type { FieldData } from '../types';

interface FieldListScreenProps {
  navigation: {
    navigate: (screen: string, params?: { fieldId?: string }) => void;
  };
}

export default function FieldListScreen({ navigation }: FieldListScreenProps) {
  const { fields, bookings, loading, deleteField } = useAppContext();

  const totals = useMemo(() => {
    const activeCount = fields.filter(field => field.status === 'Hoạt động').length;
    return {
      activeCount,
      totalCount: fields.length,
    };
  }, [fields]);

  const handleDelete = (field: FieldData) => {
    const fieldBookings = bookings.filter(item => item.fieldId === field.id);

    if (fieldBookings.length > 0) {
      Alert.alert(
        'Không thể xóa sân',
        'Sân đang có lượt đặt. Vui lòng hủy các lượt đặt liên quan trước khi xóa sân.',
      );
      return;
    }

    Alert.alert('Xác nhận xóa', `Bạn có muốn xóa sân ${field.name}?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          const success = await deleteField(field.id);
          if (success) {
            Alert.alert('Thành công', 'Sân đã được xóa.');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: FieldData }) => (
    <FieldCard
      field={item}
      bookingCount={bookings.filter(booking => booking.fieldId === item.id).length}
      onPress={() => navigation.navigate('FieldDetail', { fieldId: item.id })}
      onEdit={() => navigation.navigate('FieldForm', { fieldId: item.id })}
      onDelete={() => handleDelete(item)}
    />
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Quản lý sân bóng</Text>
          <Text style={styles.subtitle}>{totals.activeCount}/{totals.totalCount} sân hoạt động</Text>
        </View>
        <AppButton label="+ Thêm sân" onPress={() => navigation.navigate('FieldForm')} />
      </View>

      {fields.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Chưa có sân nào được thêm.</Text>
        </View>
      ) : (
        <FlatList
          data={fields}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 28,
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
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
