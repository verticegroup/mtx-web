const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];

/* ---------- visor 360° ----------
   La posición es continua (p = 2.4 → 40 % entre la foto 3 y la 4) y cada foto es una capa:
   se funden entre sí con mix-blend-mode: plus-lighter (fundido real, sin que baje el brillo).
   Arrastrar mueve p con el dedo; al soltar se asienta en la foto más cercana. */
const v = $('[data-360]');
if (v) {
  const base = $<HTMLImageElement>('.v360-img', v)!;
  const frames: Record<string, string[]> = JSON.parse(v.dataset.frames || '{}');
  const sides: Record<string, { r: string; l: string }> = JSON.parse(v.dataset.sides || '{}');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const plus = CSS.supports('mix-blend-mode', 'plus-lighter');
  const layers = document.createElement('div');
  layers.className = 'v360-layers';
  base.after(layers);

  type Stack = { el: HTMLDivElement; imgs: HTMLImageElement[]; ready: Promise<void> };
  const stacks = new Map<string, Stack>();
  const stackFor = (c: string): Stack => {
    let s = stacks.get(c);
    if (s) return s;
    const el = document.createElement('div');
    el.className = 'v360-stack';
    const imgs = frames[c].map((u) => {
      const i = new Image();
      i.decoding = 'async'; i.alt = ''; i.draggable = false; i.src = u;
      el.appendChild(i); return i;
    });
    layers.appendChild(el);
    const ready = Promise.all(imgs.map((i) => i.decode().catch(() => undefined))).then(() => undefined);
    s = { el, imgs, ready }; stacks.set(c, s); return s;
  };

  let color = Object.keys(frames)[0];
  let p = 0;          // posición continua en "fotos"
  let live = false;   // true cuando las capas del color actual ya están decodificadas
  const n = () => frames[color].length;
  const mod = (x: number, m: number) => ((x % m) + m) % m;

  const render = () => {
    const N = n(), q = mod(p, N), i = Math.floor(q), f = q - i, j = (i + 1) % N;
    if (!live) { base.removeAttribute('srcset'); base.src = frames[color][Math.round(q) % N]; return; }
    stacks.get(color)!.imgs.forEach((img, k) => {
      let o = 0;
      if (plus) o = k === i ? 1 - f : k === j ? f : 0;
      else o = k === i ? Math.min(1, 2 * (1 - f)) : k === j ? Math.min(1, 2 * f) : 0; // sin plus-lighter: sin bajón de brillo
      img.style.opacity = String(o);
    });
  };

  const show = async (c: string) => {
    const s = stackFor(c);
    await s.ready;
    if (c !== color) return;
    stacks.forEach((o, k) => o.el.classList.toggle('on', k === c));
    live = true; v.classList.add('ready'); render();
  };
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { show(color); io.disconnect(); } }, { rootMargin: '400px' });
  io.observe(v);

  /* animación de p hacia un destino */
  let raf = 0;
  const ease = (t: number) => (t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
  const animateTo = (to: number, ms: number, curve = ease) => {
    cancelAnimationFrame(raf);
    const from = p, t0 = performance.now();
    if (reduce || ms <= 0) { p = to; render(); return; }
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      p = from + (to - from) * curve(k); render();
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };

  /* arrastrar */
  let x0: number | null = null, p0 = 0, moved = false, lastX = 0, lastT = 0, vel = 0;
  const step = () => Math.max(24, v.clientWidth / (n() * 1.6)); // px por foto
  v.addEventListener('pointerdown', (e) => {
    cancelAnimationFrame(raf);
    x0 = e.clientX; p0 = p; moved = false; lastX = e.clientX; lastT = performance.now(); vel = 0;
    v.setPointerCapture(e.pointerId); v.classList.add('is-drag'); show(color);
  });
  v.addEventListener('pointermove', (e) => {
    if (x0 === null) return;
    const d = (x0 - e.clientX) / step();
    if (Math.abs(x0 - e.clientX) > 3) { moved = true; v.classList.add('used'); }
    const t = performance.now();
    vel = (lastX - e.clientX) / step() / Math.max(1, t - lastT); lastX = e.clientX; lastT = t;
    p = p0 + d; render();
  });
  const end = () => {
    if (x0 === null) return;
    x0 = null; v.classList.remove('is-drag');
    // pequeña inercia y se asienta en la foto más cercana
    const target = Math.round(p + Math.max(-1, Math.min(1, vel * 180)));
    animateTo(target, 260 + 120 * Math.abs(target - p), (t) => 1 - (1 - t) ** 3);
  };
  v.addEventListener('pointerup', end);
  v.addEventListener('pointercancel', end);

  /* botón 360: una vuelta completa y fluida */
  const spin = () => { show(color); v.classList.add('used'); animateTo(Math.round(p) + n(), n() * 420); };
  $('.v360-badge', v)?.addEventListener('click', () => { if (!moved) spin(); });

  v.tabIndex = 0;
  v.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault(); show(color); v.classList.add('used');
    animateTo(Math.round(p) + (e.key === 'ArrowRight' ? 1 : -1), 360);
  });

  /* colores: se funden las dos pilas en la misma posición */
  $$('.swatches [role=radio]').forEach((b) => b.addEventListener('click', () => {
    $$('.swatches [role=radio]').forEach((o) => o.setAttribute('aria-checked', String(o === b)));
    color = b.dataset.color!;
    if (live) { live = false; show(color); } // la pila nueva aparece fundida cuando sus fotos están listas
    else render();
    const sm = $<HTMLImageElement>('.p-main .bike-sm'), lg = $<HTMLImageElement>('.p-main .bike-lg');
    if (sm && sides[color]) { sm.removeAttribute('srcset'); sm.src = sides[color].r; }
    if (lg && sides[color]) { lg.removeAttribute('srcset'); lg.src = sides[color].l; }
  }));
}

/* ---------- acordeones de la ficha técnica ---------- */
$$('[data-acc]').forEach((acc) => {
  const btn = $('.pill', acc)!, panel = $('.specs', acc)!;
  btn.addEventListener('click', () => {
    const open = !acc.classList.contains('is-open');
    if (open) {
      acc.classList.add('is-open');
      const h = panel.scrollHeight; panel.style.height = '0px';
      requestAnimationFrame(() => { panel.style.height = h + 'px'; });
      panel.addEventListener('transitionend', () => { panel.style.height = ''; }, { once: true });
    } else {
      panel.style.height = panel.scrollHeight + 'px';
      requestAnimationFrame(() => acc.classList.remove('is-open'));
    }
    btn.setAttribute('aria-expanded', String(open));
  });
});

/* ---------- especiales: puntos con foto de detalle ---------- */
const pop = $('.spot-pop');
const sec = pop?.closest<HTMLElement>('[data-puntos]');
if (pop && sec) {
  const puntos: string[] = JSON.parse(sec.dataset.puntos || '[]');
  const close = () => { pop.hidden = true; $$('.spot.on, .esp-list .on').forEach((x) => x.classList.remove('on')); };
  const open = (n: string) => {
    const spot = $(`.spot[data-spot="${n}"]`); if (!spot) return;
    close();
    spot.classList.add('on');
    $(`.esp-list [data-spot="${n}"]`)?.classList.add('on');
    const im = $<HTMLImageElement>('img', pop)!;
    const url = puntos[Number(n) - 1];
    im.hidden = !url; if (url) im.src = url;
    im.alt = spot.getAttribute('aria-label') ?? '';
    $('p', pop)!.textContent = spot.getAttribute('aria-label');
    pop.hidden = false;
    if (matchMedia('(max-width: 1023px)').matches) return; // en móvil es una hoja inferior (CSS)
    const sr = sec.getBoundingClientRect(), r = spot.getBoundingClientRect();
    let left = r.left - sr.left + r.width + 12;
    let top = r.top - sr.top - pop.offsetHeight / 2;
    if (left + pop.offsetWidth > sr.width - 12) left = r.left - sr.left - pop.offsetWidth - 12;
    top = Math.max(12, Math.min(top, sr.height - pop.offsetHeight - 12));
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
  };
  $$('[data-spot]', sec).forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    b.classList.contains('on') ? close() : open(b.dataset.spot!);
  }));
  $('.pop-x', pop)?.addEventListener('click', close);
  document.addEventListener('click', (e) => { if (!pop.hidden && !pop.contains(e.target as Node)) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* ---------- galería: arrastrar con el mouse ---------- */
const tr = $('.gal-track');
if (tr) {
  let x0: number | null = null, s0 = 0;
  tr.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    x0 = e.clientX; s0 = tr.scrollLeft; tr.style.scrollSnapType = 'none'; tr.setPointerCapture(e.pointerId);
  });
  tr.addEventListener('pointermove', (e) => { if (x0 !== null) tr.scrollLeft = s0 - (e.clientX - x0); });
  const up = () => { if (x0 === null) return; x0 = null; tr.style.scrollSnapType = ''; };
  tr.addEventListener('pointerup', up);
  tr.addEventListener('pointercancel', up);
}

export {};
