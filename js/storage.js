/* =========================================================================
   STORAGE — thin wrapper around localStorage.
   Everything lives under a few namespaced keys so it's easy to inspect
   or clear from devtools if needed.
   ========================================================================= */

const Storage = (() => {
  const KEYS = {
    startDate: "ftw_programStartDate",
    completions: "ftw_completions",
    settings: "ftw_settings"
  };

  function todayISO(d = new Date()) {
    const tz = d.getTimezoneOffset() * 60000;
    return new Date(d - tz).toISOString().slice(0, 10);
  }

  function getStartDate() {
    return localStorage.getItem(KEYS.startDate) || null;
  }

  function setStartDate(isoDate) {
    localStorage.setItem(KEYS.startDate, isoDate);
  }

  function getSettings() {
    const raw = localStorage.getItem(KEYS.settings);
    const defaults = { restDefault: 60 };
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  }

  function setSettings(partial) {
    const current = getSettings();
    localStorage.setItem(KEYS.settings, JSON.stringify({ ...current, ...partial }));
  }

  function getAllCompletions() {
    const raw = localStorage.getItem(KEYS.completions);
    return raw ? JSON.parse(raw) : {};
  }

  function getDayRecord(dateISO) {
    const all = getAllCompletions();
    return all[dateISO] || { exercises: {}, dayComplete: false };
  }

  function toggleExercise(dateISO, exerciseKey, totalCount) {
    const all = getAllCompletions();
    const rec = all[dateISO] || { exercises: {}, dayComplete: false };
    rec.exercises[exerciseKey] = !rec.exercises[exerciseKey];
    const doneCount = Object.values(rec.exercises).filter(Boolean).length;
    rec.dayComplete = doneCount >= totalCount && totalCount > 0;
    all[dateISO] = rec;
    localStorage.setItem(KEYS.completions, JSON.stringify(all));
    return rec;
  }

  function setDayComplete(dateISO, complete) {
    const all = getAllCompletions();
    const rec = all[dateISO] || { exercises: {}, dayComplete: false };
    rec.dayComplete = complete;
    all[dateISO] = rec;
    localStorage.setItem(KEYS.completions, JSON.stringify(all));
    return rec;
  }

  function clearAll() {
    localStorage.removeItem(KEYS.startDate);
    localStorage.removeItem(KEYS.completions);
    localStorage.removeItem(KEYS.settings);
  }

  return {
    todayISO, getStartDate, setStartDate, getSettings, setSettings,
    getAllCompletions, getDayRecord, toggleExercise, setDayComplete, clearAll
  };
})();
