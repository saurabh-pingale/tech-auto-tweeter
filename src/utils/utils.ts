export function normalizeDate(dateValue: any): Date {
  if (!dateValue) return new Date(0);
  return typeof dateValue === "number" ? new Date(dateValue * 1000) : dateValue;
}