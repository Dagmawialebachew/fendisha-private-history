const TAU = Math.PI * 2;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function random(min, max) {
  return min + Math.random() * (max - min);
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function makeParticle(width, height, palette, mode = 'fall') {
  const depth = random(.48, 1.16);
  const kindRoll = Math.random();
  const kind = kindRoll < .57 ? 'paper' : kindRoll < .74 ? 'ribbon' : kindRoll < .90 ? 'pearl' : 'heart';
  const baseSize = random(5.5, 11.5) * depth;

  if (mode === 'burst') {
    const angle = random(Math.PI * 1.08, Math.PI * 1.92);
    const speed = random(4.4, 10.2) * depth;

    return {
      x: width * random(.40, .60),
      y: height * random(.23, .39),
      vx: Math.cos(angle) * speed + random(-1.8, 1.8),
      vy: Math.sin(angle) * speed - random(3.2, 7.0),
      gravity: random(.105, .18) * depth,
      drag: random(.986, .994),
      rotation: random(0, TAU),
      spin: random(-.12, .12),
      wobble: random(0, TAU),
      wobbleSpeed: random(.035, .085),
      size: baseSize * random(.85, 1.35),
      depth,
      color: randomItem(palette),
      kind,
      life: random(145, 230),
      maxLife: 230,
      opacity: random(.72, .98),
    };
  }

  return {
    x: random(-20, width + 20),
    y: random(-height * .75, -20),
    vx: random(-.55, .55) * depth,
    vy: random(1.25, 2.9) * depth,
    gravity: random(.003, .014),
    drag: .999,
    rotation: random(0, TAU),
    spin: random(-.045, .045),
    wobble: random(0, TAU),
    wobbleSpeed: random(.02, .055),
    size: baseSize,
    depth,
    color: randomItem(palette),
    kind,
    life: Infinity,
    maxLife: Infinity,
    opacity: random(.48, .88),
  };
}

function drawHeart(ctx, size) {
  const s = size / 12;
  ctx.beginPath();
  ctx.moveTo(0, 3 * s);
  ctx.bezierCurveTo(-6 * s, -2 * s, -7 * s, 4 * s, 0, 9 * s);
  ctx.bezierCurveTo(7 * s, 4 * s, 6 * s, -2 * s, 0, 3 * s);
  ctx.fill();
}

function drawParticle(ctx, particle) {
  const { kind, size, color, rotation, opacity, depth } = particle;
  const flutter = Math.sin(particle.wobble) * .38;

  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate(rotation + flutter);
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;

  if (depth > 1.07) {
    ctx.shadowColor = 'rgba(111,59,142,.14)';
    ctx.shadowBlur = 6;
  }

  if (kind === 'paper') {
    ctx.fillRect(-size * .48, -size * .32, size * .96, size * .64);
  } else if (kind === 'ribbon') {
    ctx.beginPath();
    ctx.roundRect(-size * .18, -size * .88, size * .36, size * 1.76, Math.max(1, size * .12));
    ctx.fill();
  } else if (kind === 'pearl') {
    const gradient = ctx.createRadialGradient(-size*.18, -size*.22, 0, 0, 0, size*.62);
    gradient.addColorStop(0, 'rgba(255,255,255,.98)');
    gradient.addColorStop(.45, color);
    gradient.addColorStop(1, 'rgba(154,91,184,.28)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, size * .48, 0, TAU);
    ctx.fill();
  } else {
    drawHeart(ctx, size);
  }

  ctx.restore();
}

export function startBirthdayConfetti(canvas, {
  palette = ['#8f4fb3', '#b780dc', '#e79ac7', '#f5c6df', '#ffffff', '#f8efff'],
  intensity = 1,
} = {}) {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return { stop() {} };

  const reduced = prefersReducedMotion();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const particles = [];
  let width = 0;
  let height = 0;
  let running = true;
  let frame = 0;
  let targetWind = 0;
  let wind = 0;
  let lastPointerX = null;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed() {
    const burstCount = Math.round((reduced ? 34 : 96) * intensity);
    const fallCount = Math.round((reduced ? 28 : (width < 640 ? 76 : 112)) * intensity);

    for (let i = 0; i < burstCount; i += 1) {
      particles.push(makeParticle(width, height, palette, 'burst'));
    }

    for (let i = 0; i < fallCount; i += 1) {
      const p = makeParticle(width, height, palette, 'fall');
      p.y = random(-height, height * .85);
      particles.push(p);
    }
  }

  function recycle(particle) {
    const replacement = makeParticle(width, height, palette, 'fall');
    Object.assign(particle, replacement, {
      y: random(-80, -12),
    });
  }

  function update(particle) {
    particle.wobble += particle.wobbleSpeed;
    particle.rotation += particle.spin;
    particle.vx = (particle.vx + wind * .018 * particle.depth) * particle.drag;
    particle.vy = particle.vy * particle.drag + particle.gravity;
    particle.x += particle.vx + Math.sin(particle.wobble) * .23 * particle.depth;
    particle.y += particle.vy;

    if (Number.isFinite(particle.life)) {
      particle.life -= 1;
      if (particle.life < 52) particle.opacity *= .965;
    }

    if (
      particle.y > height + 55 ||
      particle.x < -90 ||
      particle.x > width + 90 ||
      particle.life <= 0
    ) {
      recycle(particle);
    }
  }

  function tick() {
    if (!running) return;

    frame = requestAnimationFrame(tick);
    wind += (targetWind - wind) * .038;
    targetWind *= .985;

    ctx.clearRect(0, 0, width, height);

    particles.sort((a, b) => a.depth - b.depth);
    particles.forEach((particle) => {
      update(particle);
      drawParticle(ctx, particle);
    });
  }

  function onPointerMove(event) {
    const x = event.touches?.[0]?.clientX ?? event.clientX;
    if (!Number.isFinite(x)) return;

    if (lastPointerX != null) {
      targetWind = clamp((x - lastPointerX) * .16, -3.5, 3.5);
    }
    lastPointerX = x;
  }

  function onPointerEnd() {
    lastPointerX = null;
  }

  resize();
  seed();
  tick();

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerEnd, { passive: true });
  window.addEventListener('touchend', onPointerEnd, { passive: true });

  return {
    stop() {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
      ctx.clearRect(0, 0, width, height);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('touchend', onPointerEnd);
    },
  };
}
