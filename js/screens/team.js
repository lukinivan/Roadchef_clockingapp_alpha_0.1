import { team, LOCATIONS } from '../data/team.js';
import { mondayIndex } from '../utils/dates.js';
import { initials } from '../utils/format.js';
import { renderLocationChips } from '../ui/locationChips.js';

let activeLoc = LOCATIONS[0].key;

function renderTeamList() {
  const idx = mondayIndex(new Date());
  const people = team.filter(p => p.location === activeLoc && p.pattern[idx]);

  document.getElementById('teamList').innerHTML = people.length
    ? people.map(p => `
      <div class="person-row">
        <div class="avatar">${initials(p.name)}</div>
        <div style="flex:1;">
          <div class="person-name">${p.name}</div>
          <div class="person-meta">${p.role}</div>
        </div>
        <div class="next-shift-time" style="font-size:14px;">${p.pattern[idx].start}–${p.pattern[idx].end}</div>
      </div>
    `).join('')
    : `<div class="muted-note">Nobody scheduled today at this location.</div>`;
}

export function initTeam() {
  renderLocationChips(document.getElementById('teamLocFilter'), activeLoc, loc => {
    activeLoc = loc;
    renderTeamList();
  });
  renderTeamList();
}
