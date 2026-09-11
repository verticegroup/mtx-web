const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];

/* ---------- visor 360° ---------- */
const v = $('[data-360]');
if (v) {
  const img = $<HTMLImageElement>('.v360-img', v)!;
  const frames: Record<string, string[]> = JSON.parse(v.dataset.frames || '{}');
  const sides: Record<string, { r: string; l: string }> = JSON.parse(v.dataset.sides || '{}');
  let color = Object.keys(frames)[0];
  let frame = 0;
  const loaded = new Set<string>();
  const preload = (c: string) => {
    if (loaded.has(c)) return; loaded.add(c);
    frames[c].forEach((u) => { const i = new Image(); i.decoding = 'async'; i.src = u; });
  };
  const show = () => { img.removeAttribute('srcset'); img.src = frames[color][frame]; };
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { preload(color); io.disconnect(); } }, { rootMargin: '400px' });
  io.observe(v);

  let x0: number | null = null, f0 = 0, moved = false;
  const step = () => Math.max(24, v.clientWidth / (frames[color].length * 1.6));
  v.addEventListener('pointerdown', (e) => { x0 = e.clientX; f0 = frame; moved = false; v.setPointerCapture(e.pointerId); v.classList.add('is-drag'); preload(color); });
  v.addEventListener('pointermove', (e) => {
    if (x0 === null) return;
    const d = Math.round((x0 - e.clientX) / step());
    if (d !== 0) moved = true;
    const n = frames[color].length;
    const nf = (((f0 + d) % n) + n) % n;
    if (nf !== frame) { frame = nf; show(); v.classList.add('used'); }
  });
  const end = () => { x0 = null; v.classList.remove('is-drag'); };
  v.addEventListener('pointerup', end);
  v.addEventListener('pointercancel', end);

  const spin = () => {
    preload(color); v.classList.add('used');
    const n = frames[color].length; let k = 0;
    const t = window.setInterval(() => { frame = (frame + 1) % n; show(); if (++k >= n) window.clearInterval(t); }, 140);
  };
  $('.v360-badge', v)?.addEventListener('click', () => { if (!moved) spin(); });
  v.tabIndex = 0;
  v.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const n = frames[color].length;
    frame = (frame + (e.key === 'ArrowRight' ? 1 : -1) + n) % n; show(); v.classList.add('used');
  });

  $$('.swatches [role=radio]').forEach((b) => b.addEventListener('click', () => {
    $$('.swatches [role=radio]').forEach((o) => o.setAttribute('aria-checked', String(o === b)));
    color = b.dataset.color!;
    frame = Math.min(frame, frames[color].length - 1);
    preload(color); show();
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
