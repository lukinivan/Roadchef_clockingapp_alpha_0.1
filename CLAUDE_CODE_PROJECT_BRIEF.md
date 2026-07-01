# Project Brief — RoadChef Clocking App (alpha 0.1)

Paste this as your first message to Claude Code in the project folder, or save it as `CLAUDE.md` in the repo root so Claude Code loads it automatically every session.

---

## Context

I'm Ivan, a Barista Maestro / shift leader at a Costa Coffee franchise (RoadChef Hamilton & Bothwell Services, UK). The official company app ("roadchef" — built on a large corporate HR/rota platform) is slow (60–300 seconds just to log in), buried under unnecessary tabs (News & Social, Surveys, Just the Job, Documents, Hapi rewards), and clock-in is gated behind a clunky location check. I only use two things daily: **clocking in/out** and **checking the rota** — everything else is noise.

This project is a **personal companion app** (an "overlay"), not a replacement for the official app — the official app remains mandatory for the company. Goal: something fast, clean, and pleasant that surfaces just the few things that matter, starting with my two locations (Hamilton, Bothwell), with the intent to expand to more RoadChef sites later if it proves useful.

There used to be a third-party app that did this well before RoadChef switched providers and developers — this project is essentially rebuilding that experience, independently.

## Repository

`https://github.com/lukinivan/Roadchef_clockingapp_alpha_0.1.git`
(name is a placeholder — will rename later)

## Current state

A static HTML/CSS/JS interactive mockup already exists (built in a separate Claude.ai chat) — I'll paste/upload it as the starting `index.html`. It includes:

- **Theme system**: 3 themes via CSS variables, switchable at runtime — `espresso` (default, warm coffee red/black, refined vs. the brand's harsh red), `latte` (calm, light), `slate` (calm, dark for early/late shifts). Swatches in a bottom sheet, triggered by a header icon.
- **4 screens** with bottom tab navigation: Home, Rota, Team, Leave.
- **Home**: a circular progress-ring button for Clock In/Out. When clocked in, it counts down time *remaining* until scheduled shift end (updates every 30s, not a stopwatch). Shows today's/next shift and weekly hours summary.
- **Clock in/out confirmation rules** (already implemented in JS, keep this logic):
  - Clock in within 10 minutes of scheduled start, or any time after (including late) → no confirmation.
  - Clock in more than 10 minutes early, or on a day with no scheduled shift → show a confirm dialog.
  - Clock out before scheduled end → confirm dialog. Clock out at/after scheduled end → no confirmation.
- **Rota screen**: Week/Month toggle with prev/next navigation. Month view is a calendar grid with dots on shift days; tapping a day shows shift details.
- **Team screen**: who's working today, filterable by location (Bothwell/Hamilton), with on-shift/off-shift status.
- **Leave screen**: balance and booked days — deliberately low-priority, used rarely.
- All UI copy is in **English**.
- Fonts: Fraunces (display), Inter (body/UI), JetBrains Mono (times/data) via Google Fonts.

All data is currently **mock/hardcoded** in JS, structured as a clearly separated data layer so it can later be swapped for a real API source without touching the UI.

## Critical constraint — no real API access yet

There is no confirmed, authorized API for the real RoadChef rota/clocking system. Do **not** attempt to reverse-engineer, bypass certificate pinning, or otherwise access the official app's backend without explicit authorization. The plan is to request official API/export access via HR/IT, or use a legitimate export (e.g. iCal/CSV) if one exists. Until then, keep working with the mock data layer. Never hardcode or prompt for my real RoadChef password/credentials in code — if/when real auth is added, we'll design that deliberately and separately.

## Hosting plan

Static site via **GitHub Pages** (free, no separate server needed) — push to `main`, enable Pages in repo settings. Eventually want it installable as a home-screen PWA (manifest.json + basic service worker) so it feels like a native app on my phone.

## What I'd like Claude Code to help with next

1. Set up a clean project structure in the repo (e.g. split the single HTML file into `index.html`, `styles.css`, `app.js`, and a `data/` folder for the mock data layer — your call on the best structure).
2. Add a `manifest.json` and app icons so it can be installed to a phone home screen as a PWA.
3. Set up GitHub Pages deployment.
4. Keep iterating on the UI/UX and data model as I bring more requirements.
5. Write a short `README.md` explaining what this is (personal tool, not affiliated with or endorsed by RoadChef/Costa Coffee — worth stating explicitly since it touches a company system).

I'll attach the current mockup file as a starting point.
