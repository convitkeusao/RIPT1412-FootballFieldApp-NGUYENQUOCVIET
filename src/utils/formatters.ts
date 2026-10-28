export const formatCurrency = (value: number | string): string => {
  const numericValue = Number(value) || 0;
  return `${numericValue.toLocaleString('vi-VN', { maximumFractionDigits: 0 })} đ/giờ`;
};

export const formatMoneyInput = (value: string): string => {
  const digits = value.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  const numericValue = Number(digits);
  return numericValue.toLocaleString('vi-VN', { maximumFractionDigits: 0 });
};

export const parseMoneyInput = (value: string): number => {
  const digits = value.replace(/\D/g, '');
  return digits ? Number(digits) : 0;
};

export const formatDateDisplay = (value?: string): string => {
  if (!value) {
    return '';
  }

  return value;
};

export const formatBookingRange = (booking?: { startHour?: number; hours?: number }): string => {
  if (!booking) {
    return '';
  }

  const endHour = Number(booking.startHour ?? 0) + Number(booking.hours ?? 0);
  return `${booking.startHour}:00-${endHour}:00`;
};

export const formatBookingSummary = (booking?: { customerName?: string; phone?: string; date?: string }): string => {
  if (!booking) {
    return '';
  }

  return `${booking.customerName} • ${booking.phone} • ${booking.date}`;
};
