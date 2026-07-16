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

  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) { /* audio unavailable — silently skip */ }
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
