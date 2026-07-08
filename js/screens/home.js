import { weekTemplate, todaysShift, findNextShift } from '../data/shifts.js';
import { DOW_SHORT, MONTH_SHORT, mondayIndex, timeOnDate } from '../utils/dates.js';
import { openConfirm } from '../ui/sheet.js';

const DAY_OFF_JOKES = [
  "Who am I gonna see today? Nobody from work — that's the whole point.",
  'Zero shifts today. Zero colleagues. Maximum peace.',
  "Coffee today is just coffee. No steam wand required.",
  "No shift, no small talk about the till float. Enjoy it.",
];

let clockedIn = false;
let activeScheduledEnd = null; // Date or null — null means an unscheduled shift

export function renderHomeStatic() {
  const shift = todaysShift();
  const label = document.getElementById('nextShiftCard').querySelector('.card-label');
  const jokeEl = document.getElementById('todayJoke');

  if (shift) {
    label.textContent = 'Today';
    document.getElementById('todayTime').textContent = `${shift.start}–${shift.end}`;
    document.getElementById('todayPill').textContent = `${shift.hrs} hrs`;
    document.getElementById('todayLoc').textContent = shift.loc;
    jokeEl.style.display = 'none';
  } else {
    const next = findNextShift();
    label.textContent = 'Day off';
    if (next) {
      const dstr = `${DOW_SHORT[mondayIndex(next.date)]} ${next.date.getDate()} ${MONTH_SHORT[next.date.getMonth()]}`;
      document.getElementById('todayTime').textContent = `${next.shift.start}–${next.shift.end}`;
      document.getElementById('todayPill').textContent = dstr;
      document.getElementById('todayLoc').textContent = `Next: ${next.shift.loc}`;
    } else {
      document.getElementById('todayTime').textContent = '—';
      document.getElementById('todayPill').textContent = '';
      document.getElementById('todayLoc').textContent = 'No upcoming shifts found';
    }
    jokeEl.textContent = DAY_OFF_JOKES[Math.floor(Math.random() * DAY_OFF_JOKES.length)];
    jokeEl.style.display = 'block';
  }

  // Week summary (current real week)
  let totalHrs = 0, count = 0;
  for (let i = 0; i < 7; i++) {
    if (weekTemplate[i]) { totalHrs += weekTemplate[i].hrs; count++; }
  }
  document.getElementById('homeWeekHrs').textContent = `${totalHrs} hrs`;
  document.getElementById('homeWeekShifts').textContent = `${count} shifts`;
}

function renderToggle() {
  const toggle = document.getElementById('shiftToggle');
  toggle.classList.toggle('on', clockedIn);
  toggle.setAttribute('aria-pressed', String(clockedIn));
  document.getElementById('toggleStatus').textContent = clockedIn ? 'On shift' : 'Off shift';
  document.getElementById('toggleSub').textContent = clockedIn ? 'Tap to end your shift' : 'Tap to start your shift';
}

// Brief spinner-into-checkmark animation (like a payment confirmation) so tapping the
// toggle feels acknowledged, even though the button's own color/text already carries state.
function playConfirmAnimation(applyState) {
  const toggle = document.getElementById('shiftToggle');
  const icon = document.getElementById('toggleIcon');
  toggle.classList.add('busy');
  icon.classList.add('confirming');
  setTimeout(() => {
    icon.classList.remove('confirming');
    icon.classList.add('confirmed');
    applyState();
    setTimeout(() => {
      icon.classList.remove('confirmed');
      toggle.classList.remove('busy');
    }, 500);
  }, 550);
}

function doClockIn() {
  playConfirmAnimation(() => {
    clockedIn = true;
    const shift = todaysShift();
    activeScheduledEnd = shift ? timeOnDate(new Date(), shift.end) : null;
    renderToggle();
  });
}

function doClockOut() {
  playConfirmAnimation(() => {
    clockedIn = false;
    activeScheduledEnd = null;
    renderToggle();
    renderHomeStatic();
  });
}

// Clock in/out confirmation rules:
// - Clock in within 10 min of scheduled start, or any time after (including late) -> no confirmation.
// - Clock in more than 10 min early, or on a day with no scheduled shift -> confirm dialog.
// - Clock out before scheduled end -> confirm dialog. At/after scheduled end -> no confirmation.
function handleToggleClick() {
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
  document.getElementById('shiftToggle').addEventListener('click', handleToggleClick);
  renderHomeStatic();
  renderToggle();
}
