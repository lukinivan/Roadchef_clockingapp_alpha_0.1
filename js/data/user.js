// Mock data — the signed-in person and their role in this app (not a real auth system yet).
// 'admin' can see the management section below; 'member' only sees their own profile.
// Replace with real auth/roles once there's a backend behind this.
export const currentUser = {
  name: 'Ivan',
  title: 'Barista Maestro',
  role: 'admin',
  locations: ['Bothwell', 'Hamilton Main', 'Hamilton DT'],
};

export const adminActions = [
  { label: 'Manage team roster', desc: 'Add, edit, or remove people from the Bothwell/Hamilton Main/Hamilton DT rosters.' },
  { label: 'Manage locations', desc: 'Add or rename the sites this app tracks.' },
  { label: 'Edit rota templates', desc: 'Change the recurring shift pattern used to build the rota.' },
  { label: 'Export data', desc: 'Download rota/team data as CSV.' },
];
