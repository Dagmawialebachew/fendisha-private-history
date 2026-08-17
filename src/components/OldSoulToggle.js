import { html } from '../lib/react.js';
import { playSfx } from '../lib/audio.js';

export function OldSoulToggle({ active, onToggle }) {
  const toggle = () => {
    playSfx('/audio/sfx/paper-seal.wav', .45);
    onToggle(!active);
  };
  return html`
    <button
      type="button"
      className=${`old-soul-toggle ${active ? 'is-active' : ''}`}
      aria-pressed=${active}
      aria-label=${active ? 'Turn off old soul mode' : 'Discover old soul mode'}
      onClick=${toggle}
    >
      <span className="old-soul-seal">✉</span>
      <span className="old-soul-label">${active ? 'return to now' : 'old soul?'}</span>
    </button>
  `;
}
