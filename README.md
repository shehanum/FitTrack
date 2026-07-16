# FitTrack — Evening Regimen (Web App)

A installable web app (PWA) version of your 12-week evening training program.
No Xcode, no App Store — it runs in Safari and installs to your iPhone's
Home Screen like a native app.

## What's included

- **Today tab** — shows the workout for the current date based on your
  program start date, with a Mon–Sun week strip showing completed/rest days.
- **Exercise detail** — tap any exercise for its illustration, a short
  how-to description, and a rest timer.
- **Rest timer** — preset buttons (30/45/60/90/120s) or your own default,
  with a start/pause/reset control and a sound + vibration cue at zero.
- **Mark complete** — check off each exercise; once all exercises in a
  session are checked, that day is logged as complete automatically.
- **Progress tab** — total workouts logged, current streak, and a two-month
  calendar with completed days highlighted.
- **Settings tab** — change your program start date, default rest duration,
  or reset all data.

Calendar sync and push reminders were intentionally left out of this first
pass, per your call to revisit those later as an enhancement.

## Installing it on your iPhone

1. Host the `webapp` folder somewhere reachable from your phone. Easiest
   options:
   - **GitHub Pages**: push this folder to a repo, enable Pages, done.
   - **Netlify/Vercel drop**: drag the folder onto their web dashboard.
   - **Quick local test**: run `python3 -m http.server 8000` from inside
     the `webapp` folder and open `http://<your-computer's-IP>:8000` from
     your phone on the same Wi-Fi.
2. Open the URL in **Safari** on your iPhone (must be Safari, not Chrome,
   for "Add to Home Screen" to install it as a standalone app).
3. Tap the **Share** button → **Add to Home Screen**.
4. Launch it from the Home Screen icon — it opens full-screen, no browser
   chrome, and works offline after the first load.

## Replacing the illustrations

Every exercise illustration lives in `assets/illustrations/` as an SVG,
named to match the `img` field in `js/data.js` (e.g. `goblet_squat.svg`).

To swap in your new illustrations:
1. Export your new art at roughly 600×720px, PNG or SVG.
2. Name each file to exactly match the existing filename it's replacing
   (e.g. your new goblet squat image should also be named
   `goblet_squat.svg` or `goblet_squat.png`).
3. Drop it into `assets/illustrations/`, overwriting the old file — or if
   you switch to `.png`, update the one-line reference in `js/data.js`
   (search for `img:`) to match the new extension. I'm also glad to do
   this swap for you directly once you have the new files — just share
   them and tell me which exercise each one is.

## Project structure

```
webapp/
  index.html            # app shell
  manifest.json          # PWA install config
  service-worker.js      # offline caching
  css/styles.css         # all styling
  js/
    data.js              # program content — exercises, sets/reps, schedule
    storage.js            # localStorage persistence
    timer.js              # rest timer logic
    app.js                 # view rendering + navigation
  assets/
    illustrations/         # exercise SVGs (swap these out)
    icons/                 # home screen app icons
```

## Known limitations (current pass)

- **Reminders/calendar**: not included yet — flagged for a later pass.
- **Data storage**: progress is saved in the browser's local storage on
  your phone. Clearing Safari's site data for this app would erase it —
  there's no cloud backup in this version. Worth adding an export/import
  button in a future pass if that's a concern.
- **Illustrations**: current set is the vector placeholder art — swap-in
  ready per above once you have the new files.
