import type { BookingData, FieldData } from '../types';

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const nextDate = (offset: number): string => {
  const value = new Date();
  value.setDate(value.getDate() + offset);
  return formatDate(value);
};

export const createInitialFields = (): FieldData[] => [
  { id: 'field-a1', name: 'Sân A1', type: '5 người', pricePerHour: 300000, status: 'Hoạt động' },
  { id: 'field-a2', name: 'Sân A2', type: '5 người', pricePerHour: 350000, status: 'Hoạt động' },
  { id: 'field-b1', name: 'Sân B1', type: '7 người', pricePerHour: 500000, status: 'Hoạt động' },
  { id: 'field-b2', name: 'Sân B2', type: '7 người', pricePerHour: 450000, status: 'Bảo trì' },
];

export const createInitialBookings = (fields: FieldData[]): BookingData[] => [
  {
    id: 'booking-1',
    fieldId: fields[0]?.id ?? 'field-a1',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    date: nextDate(0),
    startHour: 17,
    hours: 2,
  },
  {
    id: 'booking-2',
    fieldId: fields[1]?.id ?? 'field-a2',
    customerName: 'Trần Thị B',
    phone: '0987654321',
    date: nextDate(1),
    startHour: 18,
    hours: 2,
  },
  {
    id: 'booking-3',
    fieldId: fields[2]?.id ?? 'field-b1',
    customerName: 'Lê Hoàng C',
    phone: '0909090909',
    date: nextDate(2),
    startHour: 20,
    hours: 1,
  },
];
