import React, { useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import colors from '../theme/colors';
import { useAppContext } from '../context/AppContext';
import type { FieldData, FieldFormState } from '../types';
import { formatMoneyInput, parseMoneyInput } from '../utils/formatters';
import { validateFieldData } from '../utils/validation';

interface FieldFormScreenProps {
  route: {
    params?: {
      fieldId?: string;
    };
  };
  navigation: {
    goBack: () => void;
  };
}

const defaultForm: FieldFormState = {
  name: '',
  type: '5 người',
  pricePerHour: '',
  status: 'Hoạt động',
};

export default function FieldFormScreen({ route, navigation }: FieldFormScreenProps) {
  const { fields, addField, updateField } = useAppContext();
  const routeParams = route.params ?? {};
  const editingField = routeParams.fieldId
    ? fields.find((item: FieldData) => item.id === routeParams.fieldId)
    : null;

  const [form, setForm] = useState<FieldFormState>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fieldTypes: Array<FieldData['type']> = ['5 người', '7 người'];
  const fieldStatuses: Array<FieldData['status']> = ['Hoạt động', 'Bảo trì'];

  useEffect(() => {
    if (editingField) {
      setForm({
        name: editingField.name,
        type: editingField.type,
        pricePerHour: formatMoneyInput(String(editingField.pricePerHour)),
        status: editingField.status,
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingField]);

  const resolvedError = useMemo(() => Object.values(errors).find(Boolean), [errors]);

  const handleChange = <K extends keyof FieldFormState>(key: K, value: FieldFormState[K]) => {
    const nextValue = key === 'pricePerHour' ? formatMoneyInput(String(value)) : value;
    setForm(prev => ({ ...prev, [key]: nextValue }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    const payload: Partial<FieldData> = {
      ...form,
      name: form.name,
      pricePerHour: parseMoneyInput(form.pricePerHour),
      type: form.type,
      status: form.status,
    };

    const validation = validateFieldData(payload, fields, editingField?.id || null);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    const nextField: FieldData = {
      id: editingField ? editingField.id : `field-${Date.now()}`,
      name: payload.name?.trim() ?? '',
      type: (payload.type ?? '5 người') as FieldData['type'],
      pricePerHour: parseMoneyInput(String(payload.pricePerHour ?? '')),
      status: (payload.status ?? 'Hoạt động') as FieldData['status'],
    };

    const success = editingField ? await updateField(nextField) : await addField(nextField);
    setIsSubmitting(false);

    if (success) {
      Alert.alert(
        editingField ? 'Cập nhật thành công' : 'Thêm sân thành công',
        editingField ? 'Thông tin sân đã được cập nhật.' : 'Sân mới đã được lưu.',
      );
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.topBar}>
        <AppButton
          label="Quay lại"
          variant="secondary"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          textStyle={{ color: colors.text }}
        />
        <Text style={styles.title}>{editingField ? 'Chỉnh sửa sân' : 'Thêm sân mới'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formCard}>
          <AppInput
            label="Tên sân"
            value={form.name}
            onChangeText={value => handleChange('name', value)}
            placeholder="Sân A3"
            error={errors.name}
          />

          <Text style={styles.label}>Loại sân</Text>
          <View style={styles.segmentWrap}>
            {fieldTypes.map(typeItem => (
              <AppButton
                key={typeItem}
                label={typeItem}
                variant={form.type === typeItem ? 'primary' : 'secondary'}
                onPress={() => handleChange('type', typeItem)}
                style={styles.segmentButton}
                textStyle={form.type === typeItem ? undefined : { color: colors.text }}
              />
            ))}
          </View>
          {errors.type ? <Text style={styles.errorText}>{errors.type}</Text> : null}

          <AppInput
            label="Giá thuê mỗi giờ (VNĐ)"
            value={form.pricePerHour}
            onChangeText={value => handleChange('pricePerHour', value)}
            placeholder="300.000"
            keyboardType="numeric"
            error={errors.pricePerHour}
          />

          <Text style={styles.label}>Trạng thái</Text>
          <View style={styles.segmentWrap}>
            {fieldStatuses.map(statusItem => (
              <AppButton
                key={statusItem}
                label={statusItem}
                variant={form.status === statusItem ? 'primary' : 'secondary'}
                onPress={() => handleChange('status', statusItem)}
                style={styles.segmentButton}
                textStyle={form.status === statusItem ? undefined : { color: colors.text }}
              />
            ))}
          </View>
          {errors.status ? <Text style={styles.errorText}>{errors.status}</Text> : null}

          {resolvedError ? <Text style={styles.formError}>{resolvedError}</Text> : null}

          <AppButton
            label={isSubmitting ? 'Đang lưu...' : editingField ? 'Lưu thay đổi' : 'Thêm sân'}
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingTop: 20,
    paddingBottom: 12,
  },
  backButton: {
    marginRight: 12,
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 32,
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 0,
    flex: 1,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  segmentWrap: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  segmentButton: {
    flex: 1,
    minHeight: 44,
    marginRight: 8,
  },
  submitButton: {
    marginTop: 20,
    minHeight: 52,
  },
  formError: {
    color: colors.danger,
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
});
