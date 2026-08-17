import { html } from '../lib/react.js';

export function Toast({ message }) {
  if (!message) return null;
  return html`
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[100] w-[min(92vw,560px)] -translate-x-1/2 rounded-[1.5rem] border border-purple-200 bg-white/95 p-4 text-center text-sm leading-6 text-plum shadow-float backdrop-blur-2xl">
      ${message}
    </div>
  `;
}
