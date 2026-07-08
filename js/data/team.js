// Mock data — the team roster across locations. Replace with a real API/export source later.
export const LOCATIONS = [
  { key: 'bothwell', label: 'Bothwell' },
  { key: 'hamilton-main', label: 'Hamilton Main' },
  { key: 'hamilton-dt', label: 'Hamilton DT' },
];

// The fixed shift times each site runs — used when requesting a shift on a day off.
// Only Bothwell's are confirmed; Hamilton Main/DT reuse them as a placeholder until
// the real times are known.
const BOTHWELL_SLOTS = [
  { start: '06:00', end: '14:00' },
  { start: '09:00', end: '17:00' },
  { start: '14:00', end: '22:00' },
];
export const SHIFT_SLOTS = {
  bothwell: BOTHWELL_SLOTS,
  'hamilton-main': BOTHWELL_SLOTS,
  'hamilton-dt': BOTHWELL_SLOTS,
};

// Each person has a recurring weekly pattern, Mon(0)..Sun(6), same shape as the personal rota
// (js/data/shifts.js) so any date can be resolved the same way. null = day off.
export const team = [
  {
    name: 'Elena K.', role: 'Barista Maestro', location: 'bothwell',
    pattern: [
      { start: '14:00', end: '22:00' }, null,
      { start: '09:00', end: '17:00' }, null,
      { start: '14:00', end: '22:00' }, null,
      { start: '14:00', end: '22:00' },
    ],
  },
  {
    name: 'James P.', role: 'Team Member', location: 'bothwell',
    pattern: [
      { start: '06:00', end: '14:00' }, { start: '06:00', end: '14:00' }, null,
      { start: '06:00', end: '14:00' }, null,
      { start: '08:00', end: '16:00' }, null,
    ],
  },
  {
    name: 'Marta S.', role: 'Shift Leader', location: 'bothwell',
    pattern: [
      null, null,
      { start: '06:00', end: '14:00' }, { start: '06:00', end: '14:00' },
      { start: '14:00', end: '22:00' }, null,
      { start: '09:00', end: '16:00' },
    ],
  },
  {
    name: 'Ryan T.', role: 'Team Member', location: 'hamilton-main',
    pattern: [
      { start: '08:00', end: '16:00' }, null,
      { start: '08:00', end: '16:00' }, null,
      { start: '08:00', end: '16:00' }, { start: '08:00', end: '16:00' },
      null,
    ],
  },
  {
    name: 'Aisha M.', role: 'Shift Leader', location: 'hamilton-main',
    pattern: [
      null, { start: '07:00', end: '15:00' }, null,
      { start: '07:00', end: '15:00' }, { start: '07:00', end: '15:00' },
      null, { start: '09:00', end: '16:00' },
    ],
  },
  {
    name: 'Olek V.', role: 'Team Member', location: 'hamilton-dt',
    pattern: [
      { start: '06:00', end: '14:00' }, { start: '06:00', end: '14:00' },
      null, null,
      { start: '06:00', end: '14:00' }, { start: '09:00', end: '16:00' },
      null,
    ],
  },
  {
    name: 'Dawid W.', role: 'Team Member', location: 'hamilton-dt',
    pattern: [
      null, null,
      { start: '15:00', end: '21:00' }, { start: '15:00', end: '21:00' },
      { start: '15:00', end: '21:00' }, { start: '08:00', end: '15:30' },
      null,
    ],
  },
];
