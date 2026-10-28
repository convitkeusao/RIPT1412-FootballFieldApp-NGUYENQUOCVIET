export type FieldType = '5 người' | '7 người';
export type FieldStatus = 'Hoạt động' | 'Bảo trì';

export interface FieldData {
  id: string;
  name: string;
  type: FieldType;
  pricePerHour: number;
  status: FieldStatus;
}

export interface BookingData {
  id: string;
  fieldId: string;
  customerName: string;
  phone: string;
  date: string;
  startHour: number;
  hours: number;
}

export interface FieldFormState {
  name: string;
  type: FieldType;
  pricePerHour: string;
  status: FieldStatus;
}
