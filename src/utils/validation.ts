import type { BookingData, FieldData } from '../types';

export type { BookingData, FieldData, FieldStatus, FieldType } from '../types';

export const normalizeName = (value?: string | null): string =>
  String(value ?? '').trim().replace(/\s+/g, ' ');

export const isValidPhone = (value?: string | null): boolean => /^0\d{9}$/.test(String(value ?? '').trim());

export const parseDateDDMMYYYY = (value?: string | null): { day: number; month: number; year: number } | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  const match = /^\d{2}\/\d{2}\/\d{4}$/.exec(trimmed);

  if (!match) {
    return null;
  }

  const [dayString, monthString, yearString] = trimmed.split('/');
  const day = Number(dayString);
  const month = Number(monthString);
  const year = Number(yearString);

  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return { day, month, year };
};

export const validateFieldData = (
  field: Partial<FieldData> | null | undefined,
  fields: FieldData[] = [],
  currentFieldId: string | null = null,
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  const cleanName = normalizeName(field?.name);

  if (!cleanName) {
    errors.name = 'Tên sân không được để trống.';
  } else if (
    fields.some(
      item => item.id !== currentFieldId && normalizeName(item.name) === cleanName,
    )
  ) {
    errors.name = 'Tên sân đã tồn tại. Vui lòng chọn tên khác.';
  }

  if (!['5 người', '7 người'].includes(String(field?.type ?? ''))) {
    errors.type = 'Vui lòng chọn loại sân hợp lệ.';
  }

  const price = Number(field?.pricePerHour);
  if (!Number.isFinite(price) || price <= 0) {
    errors.pricePerHour = 'Giá thuê phải lớn hơn 0.';
  }

  if (!['Hoạt động', 'Bảo trì'].includes(String(field?.status ?? ''))) {
    errors.status = 'Vui lòng chọn trạng thái hợp lệ.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const checkBookingConflict = (
  existingBookings: BookingData[] = [],
  newBooking: Partial<BookingData> = {},
): boolean => {
  if (!newBooking || !newBooking.fieldId || !newBooking.date) {
    return false;
  }

  const startTime = Number(newBooking.startHour);
  const endTime = startTime + Number(newBooking.hours || 0);

  return existingBookings.some(booking => {
    if (
      booking.fieldId !== newBooking.fieldId ||
      booking.date !== newBooking.date ||
      booking.id === newBooking.id
    ) {
      return false;
    }

    const existingStart = Number(booking.startHour);
    const existingEnd = existingStart + Number(booking.hours || 0);
    return startTime < existingEnd && existingStart < endTime;
  });
};

export const validateBookingData = (
  booking: Partial<BookingData> | null | undefined,
  fields: FieldData[] = [],
  existingBookings: BookingData[] = [],
  currentBookingId: string | null = null,
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  const field = fields.find(item => item.id === booking?.fieldId);

  if (!field) {
    errors.fieldId = 'Sân không tồn tại.';
  }

  if (!normalizeName(booking?.customerName)) {
    errors.customerName = 'Tên khách hàng không được để trống.';
  }

  if (!isValidPhone(booking?.phone)) {
    errors.phone = 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.';
  }

  if (!parseDateDDMMYYYY(booking?.date)) {
    errors.date = 'Ngày không hợp lệ. Ví dụ: 28/10/2026.';
  }

  const startHour = Number(booking?.startHour);
  const hours = Number(booking?.hours);

  if (!Number.isInteger(startHour) || startHour < 6 || startHour > 22) {
    errors.startHour = 'Giờ bắt đầu phải từ 6 đến 22.';
  }

  if (!Number.isInteger(hours) || hours < 1 || hours > 3) {
    errors.hours = 'Số giờ thuê phải từ 1 đến 3.';
  }

  if (Number.isInteger(startHour) && Number.isInteger(hours) && startHour + hours > 23) {
    errors.hours = 'Giờ kết thúc không được vượt quá 23:00.';
  }

  if (field && field.status !== 'Hoạt động') {
    errors.fieldId = 'Sân đang trong trạng thái bảo trì, không thể đặt.';
  }

  if (
    field &&
    parseDateDDMMYYYY(booking?.date) &&
    Number.isInteger(startHour) &&
    Number.isInteger(hours) &&
    checkBookingConflict(existingBookings, {
      ...booking,
      id: currentBookingId ?? booking?.id ?? '',
      fieldId: booking?.fieldId,
      date: booking?.date,
      startHour,
      hours,
    })
  ) {
    errors.conflict = 'Khung giờ này đã bị trùng với một lượt đặt khác trên cùng sân.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
