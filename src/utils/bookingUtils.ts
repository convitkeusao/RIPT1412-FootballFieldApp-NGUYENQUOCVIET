export const getBookingEndHour = (startHour: number | string, hours: number | string): number =>
  Number(startHour) + Number(hours);

export const calculateBookingPrice = (
  field?: { pricePerHour?: number | string } | null,
  hours?: number | string,
): number => {
  const pricePerHour = Number(field?.pricePerHour || 0);
  const rentalHours = Number(hours || 0);
  return pricePerHour * rentalHours;
};
