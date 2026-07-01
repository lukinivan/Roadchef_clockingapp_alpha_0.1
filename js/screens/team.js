import { team } from '../data/team.js';

function initials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function renderTeam(loc) {
  document.getElementById('teamList').innerHTML = team[loc].map(p => `
    <div class="person-row">
      <div class="avatar">${initials(p.name)}</div>
      <div style="flex:1;">
        <div class="person-name">${p.name}</div>
        <div class="person-meta">${p.role}</div>
      </div>
      <div style="text-align:right;">
        <div class="person-meta"><span class="status-dot ${p.on ? 'on' : 'off'}"></span>${p.on ? 'on shift' : 'off shift'}</div>
        <div class="person-meta" style="margin-top:2px;">${p.time}</div>
      </div>
    </div>
  `).join('');
}

export function initTeam() {
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderTeam(chip.dataset.loc);
    });
  });

  renderTeam('bothwell');
}
