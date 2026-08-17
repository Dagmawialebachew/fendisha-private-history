let activeAudio = null;

const liveSfx = new Set();

function safePlay(audio) {
  const result = audio.play();
  if (result && typeof result.catch === 'function') {
    result.catch(() => {});
  }
  return audio;
}

function clampVolume(value) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0.72));
}

export function stopAudio() {
  if (!activeAudio) return;

  activeAudio.pause();
  activeAudio.currentTime = 0;
  activeAudio = null;
}

export function playAudio(src, { volume = 0.88, loop = false, fadeIn = 0 } = {}) {
  stopAudio();

  const audio = new Audio(src);
  audio.loop = loop;
  audio.preload = 'auto';

  if (fadeIn > 0) {
    audio.volume = 0;
    const target = clampVolume(volume);
    const startedAt = performance.now();

    const fade = (now) => {
      if (audio.paused) return;

      const progress = Math.min(1, (now - startedAt) / fadeIn);
      audio.volume = target * progress;

      if (progress < 1) requestAnimationFrame(fade);
    };

    safePlay(audio);
    requestAnimationFrame(fade);
  } else {
    audio.volume = clampVolume(volume);
    safePlay(audio);
  }

  activeAudio = audio;
  return audio;
}

/**
 * Backwards compatible:
 *   playSfx('/sound.wav', .5)
 *
 * Also supports:
 *   playSfx('/sound.wav', {
 *     volume: .5,
 *     playbackRate: .98,
 *     delay: 80
 *   })
 */
export function playSfx(src, volumeOrOptions = 0.72) {
  const options = typeof volumeOrOptions === 'number'
    ? { volume: volumeOrOptions }
    : (volumeOrOptions || {});

  const {
    volume = 0.72,
    playbackRate = 1,
    delay = 0,
  } = options;

  const play = () => {
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.volume = clampVolume(volume);
    audio.playbackRate = Math.max(0.5, Math.min(2, playbackRate));

    liveSfx.add(audio);

    const cleanup = () => {
      liveSfx.delete(audio);
      audio.removeEventListener('ended', cleanup);
      audio.removeEventListener('error', cleanup);
    };

    audio.addEventListener('ended', cleanup);
    audio.addEventListener('error', cleanup);

    safePlay(audio);
    return audio;
  };

  if (delay > 0) {
    const timer = setTimeout(play, delay);
    return { cancel: () => clearTimeout(timer) };
  }

  return play();
}

export function stopAllSfx() {
  liveSfx.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
  liveSfx.clear();
}
