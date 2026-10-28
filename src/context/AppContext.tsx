import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readAppData, saveAppData } from '../services/storage';
import type { BookingData, FieldData } from '../types';

interface AppContextValue {
  fields: FieldData[];
  bookings: BookingData[];
  loading: boolean;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  refreshData: () => Promise<void>;
  addField: (field: FieldData) => Promise<boolean>;
  updateField: (field: FieldData) => Promise<boolean>;
  deleteField: (fieldId: string) => Promise<boolean>;
  addBooking: (booking: BookingData) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [fields, setFields] = useState<FieldData[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await readAppData();
      if (result?.error) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } else {
        setError('');
      }
      setFields(result?.fields || []);
      setBookings(result?.bookings || []);
    } catch {
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      setFields([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const persist = useCallback(async (nextFields: FieldData[], nextBookings: BookingData[]) => {
    try {
      await saveAppData(nextFields, nextBookings);
      setFields(nextFields);
      setBookings(nextBookings);
      return true;
    } catch {
      setError('Lưu dữ liệu thất bại. Vui lòng thử lại.');
      return false;
    }
  }, []);

  const addField = useCallback(async (field: FieldData) => {
    const nextFields = [...fields, field];
    const success = await persist(nextFields, bookings);
    return success;
  }, [fields, bookings, persist]);

  const updateField = useCallback(async (field: FieldData) => {
    const nextFields = fields.map(item => (item.id === field.id ? field : item));
    const success = await persist(nextFields, bookings);
    return success;
  }, [fields, bookings, persist]);

  const deleteField = useCallback(async (fieldId: string) => {
    const nextFields = fields.filter(item => item.id !== fieldId);
    const nextBookings = bookings.filter(item => item.fieldId !== fieldId);
    const success = await persist(nextFields, nextBookings);
    return success;
  }, [fields, bookings, persist]);

  const addBooking = useCallback(async (booking: BookingData) => {
    const nextBookings = [...bookings, booking];
    const success = await persist(fields, nextBookings);
    return success;
  }, [fields, bookings, persist]);

  const cancelBooking = useCallback(async (bookingId: string) => {
    const nextBookings = bookings.filter(item => item.id !== bookingId);
    const success = await persist(fields, nextBookings);
    return success;
  }, [fields, bookings, persist]);

  const value = useMemo<AppContextValue>(() => ({
    fields,
    bookings,
    loading,
    error,
    setError,
    refreshData,
    addField,
    updateField,
    deleteField,
    addBooking,
    cancelBooking,
  }), [fields, bookings, loading, error, refreshData, addField, updateField, deleteField, addBooking, cancelBooking]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return context;
};
