import { weekTemplate } from '../data/shifts.js';
import { team, LOCATIONS, SHIFT_SLOTS } from '../data/team.js';
import { DOW_SHORT, MONTH_NAMES, MONTH_SHORT, mondayIndex, addDays, getMonday, sameDate, dateKey } from '../utils/dates.js';
import { initials } from '../utils/format.js';
import { renderLocationChips } from '../ui/locationChips.js';
import { openSheet, closeSheet, sheetContent } from '../ui/sheet.js';

let weekOffset = 0, monthOffset = 0, rotaView = 'week', selectedDate = null, dayActiveLoc = LOCATIONS[0].key;

// Pending shift requests made from the calendar, keyed by dateKey(). In-memory only —
// there's no backend yet to send these to.
const requests = {};

function renderWeek() {
  const monday = addDays(getMonday(new Date()), weekOffset * 7);
  const sunday = addDays(monday, 6);
  document.getElementById('rangeLabel').textContent =
    `${MONTH_SHORT[monday.getMonth()]} ${monday.getDate()} – ${MONTH_SHORT[sunday.getMonth()]} ${sunday.getDate()}`;

  let total = 0, rows = '';
  for (let i = 0; i < 7; i++) {
    const date = addDays(monday, i);
    const shift = weekTemplate[i];
    if (shift) total += shift.hrs;
    rows += `
      <div class="day-row">
        <div class="day-date"><div class="dow">${DOW_SHORT[i]}</div><div class="num">${date.getDate()}</div></div>
        <div class="day-body">
          ${shift ? `<div class="time">${shift.start}–${shift.end}</div><div class="loc">${shift.loc}</div>` : `<div class="day-off">Day off</div>`}
        </div>
        ${shift ? `<div class="pill">${shift.hrs} hrs</div>` : ''}
      </div>`;
  }
  document.getElementById('rotaList').innerHTML = rows;
  document.getElementById('weekHrsLabel').textContent = `${total} hrs`;
}

function renderDayTeam(date) {
  const idx = mondayIndex(date);
  const people = team.filter(p => p.location === dayActiveLoc && p.pattern[idx]);

  document.getElementById('dayTeamList').innerHTML = people.length
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
    : `<div class="muted-note">Nobody scheduled that day at this location.</div>`;
}

function openRequestSheet(date) {
  let selLoc = LOCATIONS[0].key;
  let selSlotIdx = 0;

  function paint() {
    const slots = SHIFT_SLOTS[selLoc];
    const dstr = `${DOW_SHORT[mondayIndex(date)]}, ${date.getDate()} ${MONTH_SHORT[date.getMonth()]}`;
    openSheet(`
      <h3>Request a shift</h3>
      <p>${dstr} — pick a site and a shift time.</p>
      <div class="filter-row" id="reqLocRow">
        ${LOCATIONS.map(l => `<div class="chip ${l.key === selLoc ? 'active' : ''}" data-loc="${l.key}">${l.label}</div>`).join('')}
      </div>
      <div class="filter-row" id="reqSlotRow">
        ${slots.map((s, i) => `<div class="chip ${i === selSlotIdx ? 'active' : ''}" data-slot="${i}">${s.start}–${s.end}</div>`).join('')}
      </div>
      <div class="modal-actions">
        <button class="modal-btn cancel" data-action="cancel">Cancel</button>
        <button class="modal-btn confirm" data-action="send">Send request</button>
      </div>
    `);
    sheetContent.querySelectorAll('#reqLocRow .chip').forEach(chip => {
      chip.addEventListener('click', () => { selLoc = chip.dataset.loc; selSlotIdx = 0; paint(); });
    });
    sheetContent.querySelectorAll('#reqSlotRow .chip').forEach(chip => {
      chip.addEventListener('click', () => { selSlotIdx = Number(chip.dataset.slot); paint(); });
    });
    sheetContent.querySelector('[data-action="cancel"]').addEventListener('click', closeSheet);
    sheetContent.querySelector('[data-action="send"]').addEventListener('click', () => {
      const slot = SHIFT_SLOTS[selLoc][selSlotIdx];
      requests[dateKey(date)] = { location: selLoc, start: slot.start, end: slot.end };
      closeSheet();
      renderMonth();
      showDayDetail(date);
    });
  }
  paint();
}

function cancelRequest(date) {
  delete requests[dateKey(date)];
  renderMonth();
  showDayDetail(date);
}

function showDayDetail(date) {
  const card = document.getElementById('dayDetailCard');
  const shift = weekTemplate[mondayIndex(date)];
  const request = requests[dateKey(date)];
  const dstr = `${DOW_SHORT[mondayIndex(date)]}, ${date.getDate()} ${MONTH_SHORT[date.getMonth()]}`;
  card.style.display = 'block';

  if (shift) {
    card.innerHTML = `<div class="card-label">${dstr}</div>
       <div class="next-shift-row"><div class="next-shift-time">${shift.start}–${shift.end}</div><div class="pill">${shift.hrs} hrs</div></div>
       <div class="loc-line">${shift.loc}</div>`;
  } else if (request) {
    const loc = LOCATIONS.find(l => l.key === request.location);
    card.innerHTML = `<div class="card-label">${dstr}</div>
      <div class="next-shift-row">
        <div class="next-shift-time" style="color:var(--warn);">${request.start}–${request.end}</div>
        <div class="pill" style="background:var(--warn-soft); color:var(--warn);">Requested</div>
      </div>
      <div class="loc-line">${loc.label}</div>
      <div class="muted-note cancel-request" id="cancelRequestBtn">Cancel request</div>`;
    document.getElementById('cancelRequestBtn').addEventListener('click', () => cancelRequest(date));
  } else {
    card.innerHTML = `<div class="card-label">${dstr}</div>
      <button class="request-shift-btn" id="requestShiftBtn"><span class="plus">+</span> Request to work this day</button>`;
    document.getElementById('requestShiftBtn').addEventListener('click', () => openRequestSheet(date));
  }

  document.getElementById('dayTeamSection').style.display = 'block';
  renderLocationChips(document.getElementById('dayLocFilter'), dayActiveLoc, loc => {
    dayActiveLoc = loc;
    renderDayTeam(date);
  });
  renderDayTeam(date);
}

function renderMonth() {
  const ref = new Date();
  ref.setMonth(ref.getMonth() + monthOffset);
  ref.setDate(1);
  const year = ref.getFullYear(), month = ref.getMonth();
  document.getElementById('rangeLabel').textContent = `${MONTH_NAMES[month]} ${year}`;

  const firstOfMonth = new Date(year, month, 1);
  const startPad = mondayIndex(firstOfMonth);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  let html = DOW_SHORT.map(d => `<div class="cal-dow">${d[0]}</div>`).join('');
  for (let i = 0; i < startPad; i++) html += `<div class="cal-cell pad"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const shift = weekTemplate[mondayIndex(date)];
    const isRequested = !shift && !!requests[dateKey(date)];
    const isToday = sameDate(date, today);
    const isSelected = selectedDate && sameDate(date, selectedDate);
    const stateClass = shift ? 'has-shift' : (isRequested ? 'requested' : 'off');
    html += `<div class="cal-cell ${stateClass} ${isToday ? 'today-cell' : ''} ${isSelected ? 'selected' : ''}" data-date="${date.toISOString()}">
      <span>${d}</span>${shift ? '<span class="dot"></span>' : ''}
    </div>`;
  }
  document.getElementById('calGrid').innerHTML = html;

  document.querySelectorAll('.cal-cell[data-date]').forEach(cell => {
    cell.addEventListener('click', () => {
      selectedDate = new Date(cell.dataset.date);
      renderMonth();
      showDayDetail(selectedDate);
    });
  });
}

export function initRota() {
  document.querySelectorAll('.seg').forEach(seg => {
    seg.addEventListener('click', () => {
      document.querySelectorAll('.seg').forEach(s => s.classList.remove('active'));
      seg.classList.add('active');
      rotaView = seg.dataset.view;
      document.getElementById('rotaWeekView').style.display = rotaView === 'week' ? 'block' : 'none';
      document.getElementById('rotaMonthView').style.display = rotaView === 'month' ? 'block' : 'none';
      if (rotaView === 'week') renderWeek(); else renderMonth();
    });
  });

  document.getElementById('prevBtn').addEventListener('click', () => {
    if (rotaView === 'week') { weekOffset--; renderWeek(); } else { monthOffset--; renderMonth(); }
  });
  document.getElementById('nextBtn').addEventListener('click', () => {
    if (rotaView === 'week') { weekOffset++; renderWeek(); } else { monthOffset++; renderMonth(); }
  });

  renderWeek();
}
