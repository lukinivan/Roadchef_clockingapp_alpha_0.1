import { weekTemplate } from '../data/shifts.js';
import { DOW_SHORT, MONTH_NAMES, MONTH_SHORT, mondayIndex, addDays, getMonday, sameDate } from '../utils/dates.js';

let weekOffset = 0, monthOffset = 0, rotaView = 'week', selectedDate = null;

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

function showDayDetail(date) {
  const card = document.getElementById('dayDetailCard');
  const shift = weekTemplate[mondayIndex(date)];
  const dstr = `${DOW_SHORT[mondayIndex(date)]}, ${date.getDate()} ${MONTH_SHORT[date.getMonth()]}`;
  card.style.display = 'block';
  card.innerHTML = shift
    ? `<div class="card-label">${dstr}</div>
       <div class="next-shift-row"><div class="next-shift-time">${shift.start}–${shift.end}</div><div class="pill">${shift.hrs} hrs</div></div>
       <div class="loc-line">${shift.loc}</div>`
    : `<div class="card-label">${dstr}</div><div class="muted-note">Day off</div>`;
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
    const isToday = sameDate(date, today);
    const isSelected = selectedDate && sameDate(date, selectedDate);
    html += `<div class="cal-cell ${shift ? 'has-shift' : 'off'} ${isToday ? 'today-cell' : ''} ${isSelected ? 'selected' : ''}" data-date="${date.toISOString()}">
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
