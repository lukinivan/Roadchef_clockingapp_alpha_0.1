import { LOCATIONS } from '../data/team.js';

// Renders location filter chips into `container` and re-renders them (to reflect the
// active selection) on every click, notifying `onSelect` with the chosen location key.
export function renderLocationChips(container, activeKey, onSelect) {
  function paint(key) {
    container.innerHTML = LOCATIONS.map(loc => `
      <div class="chip ${loc.key === key ? 'active' : ''}" data-loc="${loc.key}">${loc.label}</div>
    `).join('');
    container.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        paint(chip.dataset.loc);
        onSelect(chip.dataset.loc);
      });
    });
  }
  paint(activeKey);
}
