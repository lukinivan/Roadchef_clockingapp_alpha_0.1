# Shift (alpha 0.1)

A personal companion app for clocking in/out and checking the rota at a Costa Coffee franchise (RoadChef Hamilton & Bothwell). It's a fast, minimal overlay for the two things used daily — the official company app remains mandatory and this does not replace it.

**Not affiliated with, endorsed by, or connected to RoadChef or Costa Coffee.** Personal project only, built for personal use.

## Status

Alpha — UI is a working prototype with mock/hardcoded data. No real API integration yet (see [CLAUDE_CODE_PROJECT_BRIEF.md](CLAUDE_CODE_PROJECT_BRIEF.md) for the full context and constraints).

## Structure

```
index.html          markup
css/styles.css       all styles (theme variables + components)
js/
  main.js            entry point, wires up the screens
  theme.js           theme picker (espresso / latte / slate)
  ui/sheet.js         shared bottom-sheet modal (theme picker + confirm dialogs)
  utils/dates.js       date helpers used across screens
  data/                 mock data layer (shifts, team) — swap for a real API later
  screens/               one file per tab: home, rota, team, nav
tools/dev-server.mjs   zero-dependency local static server (needed because ES modules don't load over file://)
```

## Running locally

Requires Node.js (only for the local dev server — the site itself is plain HTML/CSS/JS, no build step, no dependencies).

```
node tools/dev-server.mjs
```

Then open http://localhost:5500.

## Deployment

Static site, deployed via GitHub Pages.
