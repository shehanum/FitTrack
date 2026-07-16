/* =========================================================================
   REST TIMER — countdown with selectable duration, pause/resume, and an
   audible + haptic cue when it finishes. No dependencies.
   ========================================================================= */

const RestTimer = (() => {
  let remaining = 60;
  let duration = 60;
  let intervalId = null;
  let onTick = () => {};
  let onDone = () => {};
  let audioCtx = null;

  // Safari (macOS and iOS) only allows audio to start inside the call stack
  // of a direct user gesture (a tap). Creating the AudioContext here, inside
  // start() — which only ever runs from a button tap — "unlocks" it. The
  // later beep() at timer-end then just reuses this already-unlocked
  // context instead of creating a new one from inside a setInterval
  // callback, which Safari would silently refuse to play.
  function unlockAudio() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    // Play a near-silent blip right now, inside the gesture, to fully
    // unlock output on iOS Safari before we need the real alarm later.
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.01);
  }

  function tone(freq, startTime, dur, peakGain = 0.18) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);
    osc.start(startTime);
    osc.stop(startTime + dur + 0.02);
  }

  function beep() {
    try {
      if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
      if (audioCtx) {
        const now = audioCtx.currentTime;
        // three short rising beeps — more noticeable than a single tone
        tone(660, now, 0.16);
        tone(660, now + 0.22, 0.16);
        tone(880, now + 0.44, 0.28);
      }
    } catch (e) { /* audio unavailable — silently skip */ }
    // Note: navigator.vibrate has no effect on iOS Safari (Apple has never
    // implemented the Vibration API there) — this only does anything on
    // Android. Left in as a harmless no-op on iOS.
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  }

  function init({ tick, done }) {
    onTick = tick || onTick;
    onDone = done || onDone;
  }

  function setDuration(seconds) {
    duration = seconds;
    remaining = seconds;
    onTick(remaining, duration);
  }

  function start() {
    if (intervalId) return;
    unlockAudio();
    intervalId = setInterval(() => {
      remaining -= 1;
      onTick(remaining, duration);
      if (remaining <= 0) {
        stop();
        beep();
        onDone();
      }
    }, 1000);
  }

  function pause() {
    clearInterval(intervalId);
    intervalId = null;
  }

  function stop() {
    clearInterval(intervalId);
    intervalId = null;
  }

  function reset() {
    stop();
    remaining = duration;
    onTick(remaining, duration);
  }

  function isRunning() {
    return intervalId !== null;
  }

  return { init, setDuration, start, pause, stop, reset, isRunning };
})();
