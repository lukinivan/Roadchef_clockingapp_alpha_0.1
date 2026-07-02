import { currentUser, adminActions } from '../data/user.js';
import { openInfo } from '../ui/sheet.js';
import { initials } from '../utils/format.js';

export function initProfile() {
  document.getElementById('profileAvatar').textContent = initials(currentUser.name);
  document.getElementById('profileName').textContent = currentUser.name;
  document.getElementById('profileTitle').textContent = currentUser.title;
  document.getElementById('profileRole').textContent = currentUser.role === 'admin' ? 'Admin' : 'Team member';
  document.getElementById('profileLocations').textContent = currentUser.locations.join(', ');

  if (currentUser.role !== 'admin') return;

  document.getElementById('adminSection').style.display = 'block';
  document.getElementById('adminActionsList').innerHTML = adminActions.map((a, i) => `
    <div class="admin-action" data-idx="${i}">
      <div class="label">${a.label}</div>
      <div class="desc">${a.desc}</div>
    </div>
  `).join('');

  document.getElementById('adminActionsList').addEventListener('click', e => {
    const row = e.target.closest('.admin-action');
    if (!row) return;
    const action = adminActions[row.dataset.idx];
    openInfo(action.label, `${action.desc} This needs a real backend behind the app, which isn't set up yet — placeholder for now.`);
  });
}
