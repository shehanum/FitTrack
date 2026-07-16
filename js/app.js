/* =========================================================================
   APP — view rendering and state wiring. Vanilla JS, no build step.
   ========================================================================= */

const App = (() => {
  const root = document.getElementById("view-root");
  const tabs = document.querySelectorAll(".tab-btn");
  let activeTab = "today";

  // ---- program position math --------------------------------------------
  function ensureStartDate() {
    let start = Storage.getStartDate();
    if (!start) {
      start = Storage.todayISO();
      Storage.setStartDate(start);
    }
    return start;
  }

  function programPosition(forDateISO = Storage.todayISO()) {
    const start = new Date(ensureStartDate() + "T00:00:00");
    const forDate = new Date(forDateISO + "T00:00:00");
    const daysSince = Math.floor((forDate - start) / 86400000);
    const weekIndex = Math.max(0, Math.floor(daysSince / 7)); // 0-based
    const phaseIndex = Math.min(2, Math.floor(weekIndex / 4)); // 0,1,2
    const weekInPhase = (weekIndex % 4) + 1;
    return { daysSince, weekIndex, phaseIndex, weekInPhase, overallWeek: weekIndex + 1 };
  }

  function sessionFor(dateISO) {
    const pos = programPosition(dateISO);
    const phase = PROGRAM.phases[pos.phaseIndex];
    const dow = new Date(dateISO + "T00:00:00").getDay(); // 0=Sun..6=Sat
    const session = phase.schedule[dow];
    return { pos, phase, session, dow };
  }

  // ---- shell ---------------------------------------------------------------
  function switchTab(name) {
    activeTab = name;
    tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === name));
    if (name === "today") renderToday();
    if (name === "program") renderProgram();
    if (name === "progress") renderProgress();
    if (name === "settings") renderSettings();
  }

  tabs.forEach(t => t.addEventListener("click", () => switchTab(t.dataset.tab)));

  // ---- TODAY VIEW -----------------------------------------------------------
  function renderToday(dateISO = Storage.todayISO()) {
    ensureStartDate();
    const { pos, phase, session } = sessionFor(dateISO);
    const rec = Storage.getDayRecord(dateISO);
    const dateObj = new Date(dateISO + "T00:00:00");
    const dateLabel = dateObj.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    const pastWeek = weekStrip(dateISO);

    if (!session) {
      root.innerHTML = `
        <div class="today-header">
          <div class="phase-pill">Phase ${phase.id} &middot; Week ${pos.weekInPhase} of 4</div>
          <h1>${dateLabel}</h1>
        </div>
        ${pastWeek}
        <div class="rest-card">
          <div class="rest-icon">&#9866;</div>
          <h2>Rest day</h2>
          <p>No session scheduled. Recovery is part of the program &mdash; use today for an easy walk if you like, or just rest.</p>
        </div>
      `;
      return;
    }

    const total = session.exercises.length;
    const doneCount = session.exercises.filter((e, i) => rec.exercises[exKey(dateISO, i)]).length;

    root.innerHTML = `
      <div class="today-header">
        <div class="phase-pill">Phase ${phase.id} &middot; Week ${pos.weekInPhase} of 4</div>
        <h1>${dateLabel}</h1>
        <div class="session-meta">
          <span class="session-title">${session.title}</span>
          <span class="session-duration">~${session.duration} min</span>
        </div>
      </div>
      ${pastWeek}
      <div class="progress-bar-wrap">
        <div class="progress-bar"><div class="progress-bar-fill" style="width:${(doneCount/total)*100}%"></div></div>
        <div class="progress-bar-label">${doneCount} / ${total} complete</div>
      </div>
      <div class="exercise-list" id="exercise-list"></div>
    `;

    const list = document.getElementById("exercise-list");
    session.exercises.forEach((e, i) => {
      const key = exKey(dateISO, i);
      const done = !!rec.exercises[key];
      const row = document.createElement("div");
      row.className = "exercise-row" + (done ? " done" : "");
      row.innerHTML = `
        <img class="exercise-thumb" src="assets/illustrations/${e.img}.svg" alt="${e.name}" onerror="this.src='assets/illustrations/placeholder.svg'">
        <div class="exercise-info">
          <div class="exercise-name">${e.name}</div>
          <div class="exercise-prescription">${e.prescription}${e.notes ? " &middot; " + e.notes : ""}</div>
        </div>
        <button class="check-btn" data-index="${i}" aria-label="Mark complete">
          ${done ? "&#10003;" : ""}
        </button>
      `;
      row.querySelector(".exercise-thumb").addEventListener("click", () => openExerciseDetail(e, dateISO, i, total));
      row.querySelector(".exercise-info").addEventListener("click", () => openExerciseDetail(e, dateISO, i, total));
      row.querySelector(".check-btn").addEventListener("click", (ev) => {
        ev.stopPropagation();
        Storage.toggleExercise(dateISO, key, total);
        renderToday(dateISO);
      });
      list.appendChild(row);
    });
  }

  function exKey(dateISO, index) {
    return `${dateISO}_${index}`;
  }

  function weekStrip(dateISO) {
    const d = new Date(dateISO + "T00:00:00");
    const dow = d.getDay(); // 0..6, week starts rendering Mon..Sun
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(d);
    monday.setDate(d.getDate() + mondayOffset);
    let cells = "";
    for (let i = 0; i < 7; i++) {
      const cellDate = new Date(monday);
      cellDate.setDate(monday.getDate() + i);
      const cellISO = Storage.todayISO(cellDate);
      const rec = Storage.getDayRecord(cellISO);
      const { session } = sessionFor(cellISO);
      const isToday = cellISO === dateISO;
      const isRest = !session;
      const cls = ["week-cell"];
      if (isToday) cls.push("is-today");
      if (rec.dayComplete) cls.push("is-complete");
      if (isRest) cls.push("is-rest");
      cells += `<button class="${cls.join(" ")}" data-date="${cellISO}">
          <span class="week-cell-day">${WEEKDAY_LABELS[cellDate.getDay()]}</span>
          <span class="week-cell-dot"></span>
        </button>`;
    }
    return `<div class="week-strip">${cells}</div>`;
  }

  root.addEventListener("click", (ev) => {
    const cell = ev.target.closest(".week-cell");
    if (cell && activeTab === "today") renderToday(cell.dataset.date);
  });

  // ---- EXERCISE DETAIL MODAL -------------------------------------------------
  const modal = document.getElementById("exercise-modal");
  const modalBody = document.getElementById("exercise-modal-body");
  document.getElementById("modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  function closeModal() {
    RestTimer.pause();
    modal.classList.remove("open");
  }

  // ---- HELP / GUIDE MODAL -----------------------------------------------------
  const helpModal = document.getElementById("help-modal");
  const helpModalBody = document.getElementById("help-modal-body");
  document.getElementById("help-btn").addEventListener("click", openHelp);
  document.getElementById("help-modal-close").addEventListener("click", closeHelp);
  helpModal.addEventListener("click", (e) => { if (e.target === helpModal) closeHelp(); });

  function closeHelp() { helpModal.classList.remove("open"); }

  function openHelp() {
    helpModalBody.innerHTML = `
      <div class="help-content">
        <h2>Guide</h2>
        <div class="help-toc">
          <a href="#help-tabs">The tabs</a>
          <a href="#help-timer">Rest timer</a>
          <a href="#help-progress">Progress tracking</a>
          <a href="#help-backup">Backup &amp; restore</a>
          <a href="#help-newphone">Moving to a new phone</a>
        </div>

        <h3 id="help-tabs">The tabs</h3>
        <p><strong>Today</strong> shows the workout for the current date, based on your program start date (set in Settings). The strip of seven day-pills lets you tap back to any day this week to check off exercises retroactively.</p>
        <p><strong>Program</strong> is a read-only preview of all 12 weeks, so you can see what's coming.</p>
        <p><strong>Progress</strong> shows your total logged workouts, current day streak, and a two-month calendar with completed days filled in.</p>
        <p><strong>Settings</strong> is where the program start date, default rest time, and backup tools live.</p>

        <h3 id="help-timer">Rest timer</h3>
        <p>Tap any exercise to open its detail card. The timer defaults to whatever you last picked (or set as default in Settings); tap a preset or Start to begin the countdown. It plays three rising beeps and a vibration (vibration is Android-only &mdash; iPhone speakers will just get the sound) when it hits zero.</p>

        <h3 id="help-progress">Marking workouts complete</h3>
        <p>Tap the circle next to an exercise, or the "Mark exercise complete" button inside its detail card, to check it off. Once every exercise in a session is checked, that whole day is logged as complete and shows up filled in on the Progress calendar.</p>

        <h3 id="help-backup">Backup &amp; restore</h3>
        <p>All your progress lives in this browser's local storage on this phone &mdash; nowhere else, automatically. That means it's fast and works offline, but it also means clearing Safari's site data, or losing/replacing your phone, wipes it. The Export/Import tools in Settings are how you protect against that.</p>
        <p><strong>Export backup</strong> opens your phone's share sheet with a small file containing just your data: start date, every logged completion, and your timer preference &mdash; no app code, no illustrations, just your numbers. From the share sheet, tap <strong>Save to Files</strong> to pick exactly where it goes (iCloud Drive is a good choice), or AirDrop/Mail it instead. The file is named like:</p>
        <p><code>FitTrack-Backup-2026-07-16-1420.json</code></p>
        <p>&mdash; the date and time it was made, so you can always tell which export is newest and never accidentally overwrite an older one.</p>
        <div class="callout">If you save to <strong>On My iPhone</strong> instead of iCloud Drive, that copy still only exists on this phone. Choosing an iCloud Drive folder (or AirDropping/emailing it elsewhere) is what makes it a real backup &mdash; one that survives losing or replacing this device.</div>
        <p><strong>Import backup</strong> opens your phone's file picker &mdash; browse to wherever you saved the export and select it. The app reads the file directly and restores your data; nothing is uploaded or fetched over the network.</p>

        <h3 id="help-newphone">Moving to a new phone</h3>
        <ol>
          <li>On the old phone (or from iCloud Drive/email), make sure you have your latest <code>FitTrack-Backup-&hellip;.json</code> file.</li>
          <li>On the new phone, open the app's web address in Safari and use Share &rarr; <strong>Add to Home Screen</strong> to install it fresh.</li>
          <li>Open the app, go to Settings &rarr; <strong>Import backup</strong>, and select that file (from Files app, iCloud Drive, or wherever it ended up on the new phone).</li>
          <li>Your start date, history, and settings should now match the old phone exactly.</li>
        </ol>
      </div>
    `;
    helpModal.classList.add("open");
  }

  function openExerciseDetail(exercise, dateISO, index, total) {
    const key = exKey(dateISO, index);
    const rec = Storage.getDayRecord(dateISO);
    const done = !!rec.exercises[key];
    const settings = Storage.getSettings();

    modalBody.innerHTML = `
      <img class="modal-illustration" src="assets/illustrations/${exercise.img}.svg" alt="${exercise.name}" onerror="this.src='assets/illustrations/placeholder.svg'">
      <h2>${exercise.name}</h2>
      <div class="modal-prescription">${exercise.prescription}</div>
      ${exercise.notes ? `<div class="modal-note">${exercise.notes}</div>` : ""}
      <p class="modal-howto">${exercise.howTo}</p>

      <div class="timer-card">
        <div class="timer-display" id="timer-display">${settings.restDefault}</div>
        <div class="timer-presets" id="timer-presets">
          ${[30, 45, 60, 90, 120].map(s => `<button class="preset-btn ${s===settings.restDefault?"active":""}" data-secs="${s}">${s}s</button>`).join("")}
        </div>
        <div class="timer-controls">
          <button class="timer-btn" id="timer-start">Start Rest</button>
          <button class="timer-btn secondary" id="timer-reset">Reset</button>
        </div>
      </div>

      <button class="complete-toggle-btn ${done ? "is-done" : ""}" id="complete-toggle">
        ${done ? "&#10003; Marked complete" : "Mark exercise complete"}
      </button>
    `;

    RestTimer.init({
      tick: (remaining) => {
        const disp = document.getElementById("timer-display");
        if (disp) disp.textContent = Math.max(remaining, 0);
      },
      done: () => {
        const disp = document.getElementById("timer-display");
        if (disp) disp.textContent = "Go";
      }
    });
    RestTimer.setDuration(settings.restDefault);

    modalBody.querySelectorAll(".preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        modalBody.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const secs = parseInt(btn.dataset.secs, 10);
        RestTimer.setDuration(secs);
        Storage.setSettings({ restDefault: secs });
      });
    });
    document.getElementById("timer-start").addEventListener("click", (e) => {
      if (RestTimer.isRunning()) {
        RestTimer.pause();
        e.target.textContent = "Start Rest";
      } else {
        RestTimer.start();
        e.target.textContent = "Pause";
      }
    });
    document.getElementById("timer-reset").addEventListener("click", () => {
      RestTimer.reset();
      document.getElementById("timer-start").textContent = "Start Rest";
    });
    document.getElementById("complete-toggle").addEventListener("click", () => {
      const newRec = Storage.toggleExercise(dateISO, key, total);
      const isDone = !!newRec.exercises[key];
      const b = document.getElementById("complete-toggle");
      b.classList.toggle("is-done", isDone);
      b.innerHTML = isDone ? "&#10003; Marked complete" : "Mark exercise complete";
      if (activeTab === "today") renderToday(dateISO);
    });

    modal.classList.add("open");
  }

  // ---- PROGRAM BROWSE VIEW ---------------------------------------------------
  function renderProgram() {
    let html = `<div class="program-header"><h1>The Program</h1><p>12 weeks, three phases. Browse ahead any time.</p></div>`;
    PROGRAM.phases.forEach(phase => {
      html += `<div class="phase-block">
        <h2>Phase ${phase.id}: ${phase.title}</h2>
        <div class="phase-weeks">${phase.weeks}</div>
        <p class="phase-objective">${phase.objective}</p>
        <div class="day-grid">`;
      for (let dow = 1; dow <= 6; dow++) {
        const s = phase.schedule[dow];
        html += dayCard(WEEKDAY_LABELS[dow], s);
      }
      html += dayCard(WEEKDAY_LABELS[0], phase.schedule[0]);
      html += `</div></div>`;
    });
    root.innerHTML = html;
  }

  function dayCard(label, session) {
    if (!session) {
      return `<div class="day-card rest"><div class="day-card-label">${label}</div><div class="day-card-title">Rest</div></div>`;
    }
    return `<div class="day-card">
      <div class="day-card-label">${label}</div>
      <div class="day-card-title">${session.title}</div>
      <div class="day-card-count">${session.exercises.length} exercises &middot; ~${session.duration} min</div>
    </div>`;
  }

  // ---- PROGRESS VIEW ----------------------------------------------------------
  function renderProgress() {
    ensureStartDate();
    const all = Storage.getAllCompletions();
    const completedDates = Object.keys(all).filter(d => all[d].dayComplete).sort();
    const totalCompleted = completedDates.length;
    const streak = currentStreak(all);

    root.innerHTML = `
      <div class="progress-header"><h1>Progress</h1></div>
      <div class="stat-row">
        <div class="stat-card"><div class="stat-num">${totalCompleted}</div><div class="stat-label">Workouts logged</div></div>
        <div class="stat-card"><div class="stat-num">${streak}</div><div class="stat-label">Day streak</div></div>
      </div>
      <div class="calendar-wrap" id="progress-calendar"></div>
    `;
    renderCalendar(document.getElementById("progress-calendar"), all);
  }

  function currentStreak(all) {
    let streak = 0;
    let d = new Date(Storage.todayISO() + "T00:00:00");
    while (true) {
      const iso = Storage.todayISO(d);
      const { session } = sessionFor(iso);
      const rec = all[iso];
      if (session && !(rec && rec.dayComplete)) break;
      if (session) streak++;
      d.setDate(d.getDate() - 1);
      if (streak > 365) break;
    }
    return streak;
  }

  function renderCalendar(container, all) {
    const today = new Date(Storage.todayISO() + "T00:00:00");
    const monthsToShow = 2;
    let html = "";
    for (let m = monthsToShow - 1; m >= 0; m--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - m, 1);
      html += monthGrid(monthDate, all, today);
    }
    container.innerHTML = html;
  }

  function monthGrid(monthDate, all, today) {
    const year = monthDate.getFullYear(), month = monthDate.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7; // make Monday index 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const label = first.toLocaleDateString(undefined, { month: "long", year: "numeric" });

    let cells = "";
    for (let i = 0; i < startOffset; i++) cells += `<div class="cal-cell empty"></div>`;
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const iso = Storage.todayISO(cellDate);
      const rec = all[iso];
      const { session } = sessionFor(iso);
      const cls = ["cal-cell"];
      if (rec && rec.dayComplete) cls.push("complete");
      else if (!session) cls.push("rest");
      if (iso === Storage.todayISO(today)) cls.push("today");
      if (cellDate > today) cls.push("future");
      cells += `<div class="${cls.join(" ")}">${day}</div>`;
    }
    return `<div class="cal-month"><div class="cal-month-label">${label}</div><div class="cal-grid">${cells}</div></div>`;
  }

  // ---- SETTINGS VIEW ------------------------------------------------------
  function renderSettings() {
    const start = ensureStartDate();
    const settings = Storage.getSettings();
    root.innerHTML = `
      <div class="settings-header"><h1>Settings</h1></div>
      <div class="settings-block">
        <label class="settings-label" for="start-date-input">Program start date</label>
        <input type="date" id="start-date-input" class="settings-input" value="${start}">
        <p class="settings-hint">Changing this shifts which phase and week "Today" shows.</p>
      </div>
      <div class="settings-block">
        <label class="settings-label" for="rest-default-input">Default rest timer</label>
        <select id="rest-default-input" class="settings-input">
          ${[30,45,60,90,120].map(s => `<option value="${s}" ${s===settings.restDefault?"selected":""}>${s} seconds</option>`).join("")}
        </select>
      </div>
      <div class="settings-block">
        <label class="settings-label">Backup &amp; restore</label>
        <div class="backup-row">
          <button class="timer-btn secondary" id="export-btn">Export backup</button>
          <button class="timer-btn secondary" id="import-btn">Import backup</button>
        </div>
        <input type="file" id="import-file-input" accept="application/json,.json" style="display:none">
        <p class="settings-hint">Export saves a small file with your start date and every logged workout. Keep it somewhere safe (Files app, email to yourself, iCloud Drive) and use Import to restore it &mdash; including after clearing Safari data, switching phones, or a fresh install.</p>
        <p class="settings-hint" id="import-status"></p>
      </div>
      <div class="settings-block danger">
        <button class="danger-btn" id="reset-data-btn">Reset all progress</button>
        <p class="settings-hint">Clears your start date and every logged workout. Can't be undone &mdash; export a backup first if you want to keep it.</p>
      </div>
    `;
    document.getElementById("start-date-input").addEventListener("change", (e) => {
      Storage.setStartDate(e.target.value);
    });
    document.getElementById("rest-default-input").addEventListener("change", (e) => {
      Storage.setSettings({ restDefault: parseInt(e.target.value, 10) });
    });
    document.getElementById("export-btn").addEventListener("click", exportBackup);
    document.getElementById("import-btn").addEventListener("click", () => {
      document.getElementById("import-file-input").click();
    });
    document.getElementById("import-file-input").addEventListener("change", importBackup);
    document.getElementById("reset-data-btn").addEventListener("click", () => {
      if (confirm("Reset all progress and settings? This can't be undone.")) {
        Storage.clearAll();
        renderSettings();
      }
    });
  }

  async function exportBackup() {
    const json = Storage.exportData();
    // FitTrack-Backup-YYYY-MM-DD-HHmm.json — date AND time, so exporting
    // more than once in a day never silently overwrites an earlier backup,
    // and the name alone tells you what it is and when it was made.
    const now = new Date();
    const dateStamp = Storage.todayISO(now);
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const filename = `FitTrack-Backup-${dateStamp}-${hh}${mm}.json`;
    const blob = new Blob([json], { type: "application/json" });
    const statusEl = document.getElementById("import-status");

    // Prefer the native share sheet — this is what actually gives you a
    // chooser (Save to Files → pick a folder, AirDrop, Mail, etc.) on
    // iPhone. A plain <a download> link has no chooser on iOS; it just
    // drops the file straight into Downloads with no say in the matter.
    if (navigator.canShare) {
      const file = new File([blob], filename, { type: "application/json" });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: filename });
          return;
        } catch (err) {
          if (err && err.name === "AbortError") return; // user cancelled the sheet — not an error
          // otherwise fall through to the plain-download fallback below
        }
      }
    }

    // Fallback for browsers without file-sharing support (desktop Chrome/
    // Firefox, older Safari): a plain download — no chooser, but it works.
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    if (statusEl) {
      statusEl.textContent = "Downloaded — your browser doesn't support the Save-to picker, so this went straight to your default downloads location.";
      statusEl.style.color = "var(--muted)";
    }
  }

  function importBackup(e) {
    const file = e.target.files[0];
    if (!file) return;
    const statusEl = document.getElementById("import-status");
    const reader = new FileReader();
    reader.onload = () => {
      try {
        Storage.importData(reader.result);
        statusEl.textContent = "Backup restored.";
        statusEl.style.color = "var(--ok)";
        renderSettings();
      } catch (err) {
        statusEl.textContent = err.message || "Couldn't import that file.";
        statusEl.style.color = "var(--rest)";
      }
    };
    reader.onerror = () => {
      statusEl.textContent = "Couldn't read that file.";
      statusEl.style.color = "var(--rest)";
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function init() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js").catch(() => {});
    }
    switchTab("today");
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", App.init);
