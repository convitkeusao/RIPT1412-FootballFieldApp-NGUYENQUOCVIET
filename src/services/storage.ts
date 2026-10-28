import AsyncStorage from '@react-native-async-storage/async-storage';
import { createInitialBookings, createInitialFields } from '../constants/initialData';
import type { BookingData, FieldData } from '../types';

export const STORAGE_KEYS = {
  fields: '@FootballFieldApp:fields',
  bookings: '@FootballFieldApp:bookings',
  initialized: '@FootballFieldApp:initialized',
} as const;

export interface AppDataResult {
  fields: FieldData[];
  bookings: BookingData[];
  initialized: boolean;
  error?: unknown;
}

export const readAppData = async (): Promise<AppDataResult> => {
  try {
    const [fieldsRaw, bookingsRaw, initializedRaw] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.fields),
      AsyncStorage.getItem(STORAGE_KEYS.bookings),
      AsyncStorage.getItem(STORAGE_KEYS.initialized),
    ]);

    if (initializedRaw !== 'true') {
      const fields = createInitialFields();
      const bookings = createInitialBookings(fields);

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.fields, JSON.stringify(fields)),
        AsyncStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(bookings)),
        AsyncStorage.setItem(STORAGE_KEYS.initialized, 'true'),
      ]);

      return { fields, bookings, initialized: true };
    }

    const fields = fieldsRaw ? (JSON.parse(fieldsRaw) as FieldData[]) : [];
    const bookings = bookingsRaw ? (JSON.parse(bookingsRaw) as BookingData[]) : [];

    return { fields, bookings, initialized: true };
  } catch (error) {
    console.error('Lỗi khi đọc dữ liệu AsyncStorage:', error);
    return { fields: [], bookings: [], initialized: false, error };
  }
};

export const saveAppData = async (fields: FieldData[], bookings: BookingData[]): Promise<boolean> => {
  try {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.fields, JSON.stringify(fields)),
      AsyncStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(bookings)),
      AsyncStorage.setItem(STORAGE_KEYS.initialized, 'true'),
    ]);

    return true;
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu AsyncStorage:', error);
    throw error;
  }
};
