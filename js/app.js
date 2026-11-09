(() => {
  const N = window.NEGOCIO;
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // ---- Datos del negocio ----
  document.title = `${N.nombre} — Alta joyería, oro y diamantes`;
  $$('[data-nombre]').forEach((e) => (e.textContent = N.nombre));
  $$('[data-telefono]').forEach((e) => (e.textContent = N.telefonoVisible));
  $$('[data-direccion]').forEach((e) => (e.textContent = N.direccion));
  $('#anio').textContent = new Date().getFullYear();

  // ---- Todo lleva a WhatsApp ----
  $$('[data-wa]').forEach((a) => {
    const msg = a.dataset.msg || 'Hola, quisiera información.';
    a.href = `https://wa.me/${N.whatsapp}?text=${encodeURIComponent(msg)}`;
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // ---- Entrada ----
  document.body.classList.add('cargando');
  const entrar = () => {
    $('#loader').classList.add('fuera');
    document.body.classList.remove('cargando');
    $('.hero').classList.add('listo');
    $$('.hero .reveal').forEach((e) => e.classList.add('visto'));
  };
  window.addEventListener('load', () => setTimeout(entrar, reducir ? 0 : 1900));
  setTimeout(entrar, 4500); // por si una imagen tarda

  // ---- Aparecer al hacer scroll ----
  $$('.reveal').forEach((e, i) => {
    if (e.closest('.hero')) return;
    const hermanos = e.parentElement ? Array.from(e.parentElement.children).filter((c) => c.classList.contains('reveal')) : [];
    e.style.setProperty('--d', `${Math.min(hermanos.indexOf(e), 5) * 0.09}s`);
  });
  const io = new IntersectionObserver((es) => es.forEach((x) => {
    if (x.isIntersecting) { x.target.classList.add('visto'); io.unobserve(x.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach((e) => { if (!e.closest('.hero')) io.observe(e); });

  // ---- Nav ----
  const nav = $('#nav');
  const burger = $('#burger');
  const links = $('#navLinks');
  burger.addEventListener('click', () => {
    burger.classList.toggle('abierto');
    links.classList.toggle('abierto');
  });
  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') { burger.classList.remove('abierto'); links.classList.remove('abierto'); }
  });

  // ---- Scroll: nav + parallax ----
  const para = $$('[data-parallax]');
  let ticking = false;
  const alScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 40);
    if (!reducir) {
      para.forEach((img) => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        img.style.transform = `translateY(${(p * -60).toFixed(1)}px)`;
      });
    }
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(alScroll); } }, { passive: true });
  alScroll();

  // ---- Contadores ----
  const cuenta = new IntersectionObserver((es) => es.forEach((x) => {
    if (!x.isIntersecting) return;
    cuenta.unobserve(x.target);
    const el = x.target, fin = +el.dataset.cuenta, suf = el.dataset.sufijo || '', mas = 'mas' in el.dataset;
    const t0 = performance.now(), dur = reducir ? 1 : 2200;
    const paso = (t) => {
      const k = Math.min(1, (t - t0) / dur), v = Math.round(fin * (1 - Math.pow(1 - k, 4)));
      el.textContent = (mas ? '+' : '') + v.toLocaleString('es-GT') + suf;
      if (k < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }), { threshold: 0.6 });
  $$('[data-cuenta]').forEach((e) => cuenta.observe(e));

  // ---- Opiniones ----
  const ops = $$('.op');
  const puntos = $('#opPuntos');
  let actual = 0, timer;
  ops.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Opinión ${i + 1}`);
    b.addEventListener('click', () => { mostrar(i); reiniciar(); });
    puntos.appendChild(b);
  });
  function mostrar(i) {
    actual = i;
    ops.forEach((o, k) => o.classList.toggle('op--activa', k === i));
    $$('button', puntos).forEach((b, k) => b.classList.toggle('activo', k === i));
  }
  function reiniciar() { clearInterval(timer); if (!reducir) timer = setInterval(() => mostrar((actual + 1) % ops.length), 6500); }
  mostrar(0); reiniciar();

  // ---- Botones magnéticos y cursor (solo con mouse) ----
  if (matchMedia('(hover: hover) and (min-width: 901px)').matches && !reducir) {
    $$('.magnetico').forEach((b) => {
      b.addEventListener('mousemove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
      });
      b.addEventListener('mouseleave', () => { b.style.transform = ''; });
    });
    const cur = $('#cursor');
    let cx = 0, cy = 0, tx = 0, ty = 0;
    addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; cur.classList.add('visible'); });
    (function mover() { cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18; cur.style.left = cx + 'px'; cur.style.top = cy + 'px'; requestAnimationFrame(mover); })();
    $$('a, button').forEach((e) => {
      e.addEventListener('mouseenter', () => cur.classList.add('grande'));
      e.addEventListener('mouseleave', () => cur.classList.remove('grande'));
    });
  }

  // ---- Chispas doradas en el hero ----
  const cv = $('#chispas');
  if (cv && !reducir) {
    const g = cv.getContext('2d');
    let w, h, ps = [];
    const medir = () => {
      const r = cv.getBoundingClientRect(); const d = Math.min(devicePixelRatio || 1, 2);
      w = cv.width = r.width * d; h = cv.height = r.height * d;
      ps = Array.from({ length: innerWidth < 700 ? 22 : 46 }, () => nueva(true));
    };
    function nueva(inicio) {
      return { x: Math.random() * w, y: inicio ? Math.random() * h : h + 10, r: (Math.random() * 1.8 + 0.5) * (w > 1200 ? 1.4 : 1), v: Math.random() * 0.35 + 0.1, f: Math.random() * 6.28, s: Math.random() * 0.03 + 0.012 };
    }
    let visible = true;
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(cv);
    (function dibujar() {
      if (visible) {
        g.clearRect(0, 0, w, h);
        for (const p of ps) {
          p.y -= p.v; p.f += p.s;
          if (p.y < -10) Object.assign(p, nueva(false));
          const a = (Math.sin(p.f) + 1) / 2 * 0.8 + 0.1;
          const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          gr.addColorStop(0, `rgba(255,236,170,${a})`); gr.addColorStop(1, 'rgba(255,220,130,0)');
          g.fillStyle = gr; g.beginPath(); g.arc(p.x, p.y, p.r * 4, 0, 6.283); g.fill();
        }
      }
      requestAnimationFrame(dibujar);
    })();
    medir(); addEventListener('resize', medir);
  }
})();
