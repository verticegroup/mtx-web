const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];

/* ---------- menú móvil ---------- */
const toggle = $('.nav-toggle');
const setNav = (open: boolean) => {
  toggle?.setAttribute('aria-expanded', String(open));
  toggle?.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  document.documentElement.classList.toggle('nav-open', open);
};
toggle?.addEventListener('click', () => setNav(toggle.getAttribute('aria-expanded') !== 'true'));
$$('.nav a').forEach((a) => a.addEventListener('click', () => setNav(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

/* ---------- carrusel de productos (Home) ---------- */
const car = $('[data-carousel]');
if (car) {
  const slides = $$('.slide', car);
  const tabs = $$('.colorbar [role=tab]', car);
  let idx = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')));
  const go = (n: number) => {
    n = (n + slides.length) % slides.length;
    if (n === idx) return;
    const cur = slides[idx], nxt = slides[n];
    cur.classList.add('is-leaving');
    cur.setAttribute('aria-hidden', 'true');
    $$('a', cur).forEach((a) => a.setAttribute('tabindex', '-1'));
    nxt.classList.add('is-active', 'is-entering');
    nxt.removeAttribute('aria-hidden');
    $$('a', nxt).forEach((a) => a.removeAttribute('tabindex'));
    requestAnimationFrame(() => requestAnimationFrame(() => nxt.classList.remove('is-entering')));
    window.setTimeout(() => cur.classList.remove('is-active', 'is-leaving'), 450);
    tabs.forEach((t, k) => t.setAttribute('aria-selected', String(k === n)));
    idx = n;
  };
  $('.prev', car)?.addEventListener('click', () => go(idx - 1));
  $('.next', car)?.addEventListener('click', () => go(idx + 1));
  tabs.forEach((t, k) => t.addEventListener('click', () => go(k)));
  car.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(idx - 1);
    if (e.key === 'ArrowRight') go(idx + 1);
  });
  let x0: number | null = null;
  car.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
  car.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 60) go(idx + (dx < 0 ? 1 : -1));
  });
}

/* ---------- barra de scroll de puntos de venta ---------- */
const list = $('.dealers'), thumb = $('.scroll-track i');
if (list && thumb) {
  let t0: number | null = null;
  const upd = () => {
    if (t0 === null) t0 = thumb.offsetTop;
    const track = list.clientHeight, max = list.scrollHeight - track;
    thumb.style.top = (max > 0 ? t0 + (track - thumb.offsetHeight - t0) * (list.scrollTop / max) : t0) + 'px';
  };
  list.addEventListener('scroll', upd, { passive: true });
  addEventListener('resize', () => { thumb.style.top = ''; t0 = null; upd(); });
}

/* ---------- pestañas distribuidor / dealer ---------- */
$$('.tabs [role=tab]').forEach((b) => b.addEventListener('click', () => {
  $$('.tabs [role=tab]').forEach((o) => { o.classList.toggle('is-on', o === b); o.setAttribute('aria-selected', String(o === b)); });
  const hid = $<HTMLInputElement>('.pform input[name=tipo]');
  if (hid) hid.value = b.dataset.type ?? '';
}));

/* ---------- el texto escrito empieza después de la etiqueta ---------- */
const fitLabels = () => $$('.fld').forEach((f) => {
  const sp = $('span', f), inp = $('input', f);
  if (sp && inp) f.style.setProperty('--lwpx', Math.ceil(sp.offsetLeft + sp.offsetWidth + 14) + 'px');
});
fitLabels();
addEventListener('resize', fitLabels);
document.fonts?.ready.then(fitLabels);

/* ---------- formularios ---------- */
async function send(form: HTMLFormElement) {
  const url = form.dataset.endpoint;
  if (!url) { console.warn('[MTX] Formulario sin endpoint: configura src/data/site.ts'); return true; }
  const res = await fetch(url, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
  return res.ok;
}

const pform = $<HTMLFormElement>('.pform');
pform?.addEventListener('submit', async (e) => {
  e.preventDefault();
  let ok = true;
  $$<HTMLInputElement>('[required]', pform).forEach((i) => {
    const good = i.type === 'checkbox' ? i.checked : i.checkValidity() && i.value.trim() !== '';
    (i.closest('.fld') || i.closest('.consent'))?.classList.toggle('bad', !good);
    ok = ok && good;
  });
  const msg = $('.form-msg', pform)!;
  if (!ok) { msg.textContent = 'Revisa los campos marcados.'; return; }
  msg.textContent = 'Enviando…';
  try {
    msg.textContent = (await send(pform)) ? '¡Gracias! Te contactaremos pronto.' : 'No pudimos enviar el formulario. Intenta de nuevo.';
    pform.reset(); fitLabels();
  } catch { msg.textContent = 'No pudimos enviar el formulario. Intenta de nuevo.'; }
});

const cform = $<HTMLFormElement>('.cform');
if (cform) {
  const ta = $<HTMLTextAreaElement>('textarea', cform)!;
  ta.addEventListener('input', () => cform.classList.toggle('is-active', ta.value.trim().length > 0));
  cform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const em = $<HTMLInputElement>('input[type=email]', cform)!;
    if (!em.value || !em.checkValidity()) { em.focus(); return; }
    let ok = false;
    try { ok = await send(cform); } catch { ok = false; }
    cform.reset(); cform.classList.remove('is-active');
    ta.placeholder = ok ? '¡Gracias! Te responderemos pronto.' : 'No pudimos enviar tu mensaje. Intenta de nuevo.';
  });
}

export {};
