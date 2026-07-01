import { openSheet, closeSheet, sheetContent } from './ui/sheet.js';

const themeMeta = {
  espresso: { dots: ['#1C1410', '#E8562F', '#F2A65A'], name: 'Espresso', sub: 'Default' },
  latte: { dots: ['#F4EEE4', '#A66B4E', '#7C9473'], name: 'Latte', sub: 'Calm, light' },
  slate: { dots: ['#161920', '#7396C4', '#9992CC'], name: 'Slate', sub: 'Calm, dark' },
};

function openThemeSheet() {
  const current = document.getElementById('phone').getAttribute('data-theme');
  const swatches = Object.keys(themeMeta).map(key => {
    const t = themeMeta[key];
    return `<div class="swatch ${key === current ? 'active' : ''}" data-theme="${key}">
      <div class="swatch-dots">${t.dots.map(c => `<span style="background:${c}; ${c === '#F4EEE4' ? 'border:1px solid #ddd;' : ''}"></span>`).join('')}</div>
      <small>${t.name}</small><em>${t.sub}</em>
    </div>`;
  }).join('');

  openSheet(`
    <h3>Appearance</h3>
    <p>Choose a colour theme — applies instantly.</p>
    <div class="swatch-row">${swatches}</div>
  `);

  sheetContent.querySelectorAll('.swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      document.getElementById('phone').setAttribute('data-theme', sw.dataset.theme);
      setTimeout(closeSheet, 180);
    });
  });
}

export function initTheme() {
  document.getElementById('themeToggle').addEventListener('click', openThemeSheet);
}
