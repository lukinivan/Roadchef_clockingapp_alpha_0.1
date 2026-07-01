import { mondayIndex, addDays } from '../utils/dates.js';

// Mock data — weekly recurring pattern, Mon(0)..Sun(6). null = day off.
// Replace this with a real API/export source later without touching the UI code.
export const weekTemplate = [
  { start: '14:00', end: '22:00', hrs: 7.5, loc: 'Team Bothwell · 0301' }, // Mon
  null, // Tue
  { start: '06:00', end: '14:00', hrs: 8, loc: 'Team Hamilton · 0214' }, // Wed
  { start: '15:00', end: '21:00', hrs: 6, loc: 'Team Bothwell · 0301' }, // Thu
  null, // Fri
  { start: '08:00', end: '15:30', hrs: 7.5, loc: 'Team Bothwell · 0301' }, // Sat
  { start: '09:00', end: '16:00', hrs: 7, loc: 'Team Hamilton · 0214' }, // Sun
];

export function todaysShift() {
  return weekTemplate[mondayIndex(new Date())];
}

export function findNextShift() {
  for (let i = 1; i <= 14; i++) {
    const date = addDays(new Date(), i);
    const shift = weekTemplate[mondayIndex(date)];
    if (shift) return { date, shift };
  }
  return null;
}
