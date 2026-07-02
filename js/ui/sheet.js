// Shared bottom sheet — used both for the theme picker and for confirm dialogs.
const backdrop = document.getElementById('backdrop');
const sheet = document.getElementById('sheet');
export const sheetContent = document.getElementById('sheetContent');

export function openSheet(html) {
  sheetContent.innerHTML = html;
  sheet.classList.add('open');
  backdrop.classList.add('open');
}

export function closeSheet() {
  sheet.classList.remove('open');
  backdrop.classList.remove('open');
}

backdrop.addEventListener('click', closeSheet);

export function openConfirm(title, message, onConfirm) {
  openSheet(`
    <h3>${title}</h3>
    <p>${message}</p>
    <div class="modal-actions">
      <button class="modal-btn cancel" data-action="cancel">Cancel</button>
      <button class="modal-btn confirm" data-action="confirm">Confirm</button>
    </div>
  `);
  sheetContent.querySelector('[data-action="confirm"]').addEventListener('click', () => { closeSheet(); onConfirm(); });
  sheetContent.querySelector('[data-action="cancel"]').addEventListener('click', closeSheet);
}

export function openInfo(title, message) {
  openSheet(`
    <h3>${title}</h3>
    <p>${message}</p>
    <div class="modal-actions">
      <button class="modal-btn confirm" data-action="ok">Got it</button>
    </div>
  `);
  sheetContent.querySelector('[data-action="ok"]').addEventListener('click', closeSheet);
}
