import { html } from '../lib/react.js';
import { SecretHeart } from '../components/SecretHeart.js';

export function Feb13Page({ onContinue, found, onFindHeart }) {
  return html`
    <section id="feb13" className="scene px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.95fr_1.05fr]">
        <div className="order-2 lg:order-1"><img src="/media/photos/kemis-netela.jpg" alt="Darion wearing kemis and netela" className="aspect-[4/3] w-full rounded-[2.5rem] object-cover shadow-float ring-8 ring-white/60" /></div>
        <div className="order-1 lg:order-2">
          <span className="birthday-chip">13 FEBRUARY · THE INTERNET BARELY SAW THIS ONE</span>
          <h2 className="section-title mt-5">No case file.<br/><span className="text-gradient">Just this ridiculous memory.</span></h2>
          <div className="mt-6 space-y-4 text-base leading-7 text-purple-900/75 sm:text-lg sm:leading-8">
            <p>You brought me netela . I wore it. and yes, that photo still exists. Unfortunately for my reputation, I looked kind of good 😂</p>
            <p>I like this day because there are very few people I am comfortable enough with to be this stupid around.</p>
            <p className="font-display text-2xl italic text-plum">Some memories are nice because almost nobody else gets them.</p>
          </div>
        </div>
      </div>
      <${SecretHeart} id=${12} found=${found.has(12)} onFind=${onFindHeart} className="left-[8%] top-[14%]" />
      <div className="mt-12 flex justify-center"><button type="button" className="secondary-cta" onClick=${() => onContinue('distance')}>one softer page →</button></div>
    </section>
  `;
}
