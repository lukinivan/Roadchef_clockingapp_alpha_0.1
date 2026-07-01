import { weekTemplate, todaysShift, findNextShift } from '../data/shifts.js';
import { DOW_SHORT, MONTH_SHORT, mondayIndex, timeOnDate, pad } from '../utils/dates.js';
import { openConfirm } from '../ui/sheet.js';

let clockedIn = false;
let activeScheduledEnd = null; // Date or null — null means an unscheduled shift
let activeStartedAt = null;
let tickInterval = null;

export function renderHomeStatic() {
  const shift = todaysShift();
  const label = document.getElementById('nextShiftCard').querySelector('.card-label');

  if (shift) {
    label.textContent = 'Today';
    document.getElementById('todayTime').textContent = `${shift.start}–${shift.end}`;
    document.getElementById('todayPill').textContent = `${shift.hrs} hrs`;
    document.getElementById('todayLoc').textContent = shift.loc;
    document.getElementById('ringSub').textContent = `${shift.loc.split(' · ')[0]} · today ${shift.start}–${shift.end}`;
  } else {
    const next = findNextShift();
    label.textContent = 'Next shift';
    if (next) {
      const dstr = `${DOW_SHORT[mondayIndex(next.date)]} ${next.date.getDate()} ${MONTH_SHORT[next.date.getMonth()]}`;
      document.getElementById('todayTime').textContent = `${next.shift.start}–${next.shift.end}`;
      document.getElementById('todayPill').textContent = dstr;
      document.getElementById('todayLoc').textContent = next.shift.loc;
    } else {
      document.getElementById('todayTime').textContent = '—';
      document.getElementById('todayPill').textContent = '';
      document.getElementById('todayLoc').textContent = 'No upcoming shifts found';
    }
    document.getElementById('ringSub').textContent = 'No shift scheduled today';
  }

  // Week summary (current real week)
  let totalHrs = 0, count = 0;
  for (let i = 0; i < 7; i++) {
    if (weekTemplate[i]) { totalHrs += weekTemplate[i].hrs; count++; }
  }
  document.getElementById('homeWeekHrs').textContent = `${totalHrs} hrs`;
  document.getElementById('homeWeekShifts').textContent = `${count} shifts`;
}

function fmtRemaining(ms) {
  if (ms < 0) ms = 0;
  const totalMin = Math.round(ms / 60000);
  const h = Math.floor(totalMin / 60), m = totalMin % 60;
  return `${h}:${pad(m)}`;
}

function fmtElapsed(ms) {
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60), m = totalMin % 60;
  return `${h}:${pad(m)}`;
}

function updateRingTick() {
  if (!clockedIn) return;
  if (activeScheduledEnd) {
    const remaining = activeScheduledEnd - Date.now();
    document.getElementById('ringTime').textContent = fmtRemaining(remaining);
    document.getElementById('ringStatus').textContent = remaining > 0 ? 'Time remaining' : 'Shift ended';
    const h = String(activeScheduledEnd.getHours()).padStart(2, '0');
    const m = String(activeScheduledEnd.getMinutes()).padStart(2, '0');
    document.getElementById('ringSub').textContent = `Until ${h}:${m}`;
  } else {
    const elapsed = Date.now() - activeStartedAt;
    document.getElementById('ringTime').textContent = fmtElapsed(elapsed);
    document.getElementById('ringStatus').textContent = 'Time on shift';
    document.getElementById('ringSub').textContent = 'Unscheduled shift';
  }
}

function doClockIn() {
  clockedIn = true;
  activeStartedAt = Date.now();
  const shift = todaysShift();
  activeScheduledEnd = shift ? timeOnDate(new Date(), shift.end) : null;

  document.getElementById('ring').classList.add('clocked-in');
  document.getElementById('ringProgress').style.strokeDashoffset = '0';
  const btn = document.getElementById('clockBtn');
  btn.classList.add('out');
  btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="6" width="12" height="12" rx="2"/></svg> End shift`;

  updateRingTick();
  tickInterval = setInterval(updateRingTick, 30000);
}

function doClockOut() {
  clockedIn = false;
  clearInterval(tickInterval);
  document.getElementById('ring').classList.remove('clocked-in');
  document.getElementById('ringProgress').style.strokeDashoffset = '566';
  document.getElementById('ringStatus').textContent = 'Off shift';
  document.getElementById('ringTime').textContent = '--:--';
  const btn = document.getElementById('clockBtn');
  btn.classList.remove('out');
  btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg> Start shift`;
  renderHomeStatic();
}

// Clock in/out confirmation rules:
// - Clock in within 10 min of scheduled start, or any time after (including late) -> no confirmation.
// - Clock in more than 10 min early, or on a day with no scheduled shift -> confirm dialog.
// - Clock out before scheduled end -> confirm dialog. At/after scheduled end -> no confirmation.
function handleClockBtnClick() {
  const now = new Date();
  if (!clockedIn) {
    const shift = todaysShift();
    if (shift) {
      const scheduledStart = timeOnDate(now, shift.start);
      const earlyWindow = new Date(scheduledStart.getTime() - 10 * 60000);
      if (now >= earlyWindow) {
        doClockIn();
      } else {
        openConfirm(
          'Clock in early?',
          `Your shift starts at ${shift.start}, more than 10 minutes from now. Clock in anyway?`,
          doClockIn
        );
      }
    } else {
      openConfirm(
        'No shift scheduled today',
        `You don't have a shift on the rota for today. Clock in anyway?`,
        doClockIn
      );
    }
  } else {
    if (activeScheduledEnd && now < activeScheduledEnd) {
      const h = String(activeScheduledEnd.getHours()).padStart(2, '0');
      const m = String(activeScheduledEnd.getMinutes()).padStart(2, '0');
      openConfirm(
        'End shift early?',
        `Your shift is scheduled until ${h}:${m}. End it now?`,
        doClockOut
      );
    } else {
      doClockOut();
    }
  }
}

export function initHome() {
  document.getElementById('clockBtn').addEventListener('click', handleClockBtnClick);
  renderHomeStatic();
}
