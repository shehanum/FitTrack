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
  let limiter = null;

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
      // A limiter on the output lets us drive the oscillators much harder
      // (louder) without the harsh digital clipping that plain high gain
      // would cause — it gently squashes peaks instead of chopping them.
      limiter = audioCtx.createDynamicsCompressor();
      limiter.threshold.setValueAtTime(-18, audioCtx.currentTime);
      limiter.knee.setValueAtTime(6, audioCtx.currentTime);
      limiter.ratio.setValueAtTime(16, audioCtx.currentTime);
      limiter.attack.setValueAtTime(0.002, audioCtx.currentTime);
      limiter.release.setValueAtTime(0.15, audioCtx.currentTime);
      limiter.connect(audioCtx.destination);
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    // Play a near-silent blip right now, inside the gesture, to fully
    // unlock output on iOS Safari before we need the real alarm later.
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(limiter);
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.01);
  }

  function tone(freq, startTime, dur, peakGain = 0.7) {
    // Fundamental (triangle — brighter/louder-sounding than sine) plus a
    // quieter octave-up layer for extra cut-through on small phone speakers.
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(limiter);
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);
    osc.start(startTime);
    osc.stop(startTime + dur + 0.02);

    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.connect(gain2);
    gain2.connect(limiter);
    osc2.type = "square";
    osc2.frequency.value = freq * 2;
    gain2.gain.setValueAtTime(0.0001, startTime);
    gain2.gain.exponentialRampToValueAtTime(peakGain * 0.35, startTime + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);
    osc2.start(startTime);
    osc2.stop(startTime + dur + 0.02);
  }

  function beep() {
    try {
      if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
      if (audioCtx) {
        const now = audioCtx.currentTime;
        // three short rising beeps — more noticeable than a single tone
        tone(660, now, 0.18);
        tone(660, now + 0.24, 0.18);
        tone(880, now + 0.48, 0.34);
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
