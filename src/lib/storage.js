const safeParse = (value, fallback) => {
  try { return JSON.parse(value); } catch { return fallback; }
};

export const storage = {
  getFoundHearts() { return new Set(safeParse(localStorage.getItem('fendisha-hearts') || '[]', [])); },
  setFoundHearts(found) { localStorage.setItem('fendisha-hearts', JSON.stringify([...found])); },
  isUnlocked() { return localStorage.getItem('fendisha-unlocked') === 'yes'; },
  setUnlocked() { localStorage.setItem('fendisha-unlocked', 'yes'); },
  getMood() { return localStorage.getItem('fendisha-mood') || ''; },
  setMood(mood) { localStorage.setItem('fendisha-mood', mood); },
  getOldSoul() { return localStorage.getItem('fendisha-old-soul') === 'yes'; },
  setOldSoul(value) { localStorage.setItem('fendisha-old-soul', value ? 'yes' : 'no'); },
};
