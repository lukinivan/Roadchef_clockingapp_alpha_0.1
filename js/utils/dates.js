export const DOW_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
export const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Day-of-week index where Monday = 0 (JS's native getDay() has Sunday = 0)
export function mondayIndex(date) {
  return (date.getDay() + 6) % 7;
}

export function addDays(date, n) {
  const result = new Date(date);
  result.setDate(result.getDate() + n);
  return result;
}

export function getMonday(date) {
  const result = new Date(date);
  result.setDate(result.getDate() - mondayIndex(result));
  result.setHours(0, 0, 0, 0);
  return result;
}

export function sameDate(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function timeOnDate(date, hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const result = new Date(date);
  result.setHours(h, m, 0, 0);
  return result;
}
