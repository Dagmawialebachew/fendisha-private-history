import { React, html } from '../lib/react.js';
import { playSfx } from '../lib/audio.js';

export class HoldToOpen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { progress: 0, done: false, holding: false };
    this.raf = null;
    this.start = 0;
    this.target = props.duration || 3000;
  }
  componentWillUnmount() { cancelAnimationFrame(this.raf); }
  begin = (event) => {
    if (this.state.done) return;
    event.preventDefault();
    this.start = performance.now();
    this.setState({ holding: true });
    this.raf = requestAnimationFrame(this.tick);
  };
  tick = (now) => {
    const progress = Math.min(1, (now - this.start) / this.target);
    this.setState({ progress });
    if (progress >= 1) {
      playSfx('/audio/sfx/heart-chime.wav', .5);
      this.setState({ done: true, holding: false, progress: 1 });
      if (this.props.onComplete) this.props.onComplete();
      return;
    }
    this.raf = requestAnimationFrame(this.tick);
  };
  cancel = () => {
    if (this.state.done) return;
    cancelAnimationFrame(this.raf);
    this.setState({ progress: 0, holding: false });
  };
  render() {
    const deg = `${this.state.progress * 360}deg`;
    return html`
      <div className="text-center">
        <button
          type="button"
          className=${`hold-button ${this.state.done ? 'is-complete' : ''}`}
          style=${{ '--p': deg }}
          onMouseDown=${this.begin}
          onMouseUp=${this.cancel}
          onMouseLeave=${this.cancel}
          onTouchStart=${this.begin}
          onTouchEnd=${this.cancel}
          onTouchCancel=${this.cancel}
        >
          <span className="hold-progress"></span>
          <span className="relative z-10 text-4xl">💜</span>
        </button>
        <p className="mt-4 text-sm font-bold text-purple-700">
          ${this.state.done ? 'AUTHORIZED 💜' : this.state.holding ? `Yes — keep holding… ${Math.max(1, Math.ceil((this.target * (1 - this.state.progress)) / 1000))} sec` : 'PRESS + KEEP HOLDING · 3 SECONDS'}
        </p>
      </div>
    `;
  }
}
