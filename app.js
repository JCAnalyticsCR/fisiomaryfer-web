(() => {
  const WA = '50671041425';
  const MSG = {
    general: 'Hola María, vi su página web y quisiera información sobre rehabilitación oncológica.',
    onco: 'Hola María, quisiera información sobre la rehabilitación oncológica.',
    tf: 'Hola María, quisiera consultar sobre terapia física.'
  };
  const waUrl = t => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
  document.querySelectorAll('.js-wa').forEach(a => {
    const t = a.dataset.text ? `Hola María. ${a.dataset.text}.` : MSG[a.dataset.msg || 'general'];
    a.href = waUrl(t);
  });

  // Header con sombra al hacer scroll
  const hdr = document.getElementById('hdr');
  const onScroll = () => hdr.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menú móvil
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  const setMenu = open => {
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('menu-open', open);
  };
  burger.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
  matchMedia('(min-width: 1000px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  // Dock móvil: aparece cuando el CTA del hero sale de pantalla
  const dock = document.getElementById('dock');
  const heroCta = document.querySelector('.hero__cta');
  const final = document.querySelector('.final');
  let heroGone = false, finalIn = false;
  const syncDock = () => dock.classList.toggle('is-on', heroGone && !finalIn);
  new IntersectionObserver(([e]) => { heroGone = !e.isIntersecting && e.boundingClientRect.top < 0; syncDock(); }).observe(heroCta);
  new IntersectionObserver(([e]) => { finalIn = e.isIntersecting; syncDock(); }, { threshold: 0.25 }).observe(final);

  // Carrusel de testimonios: puntos + flechas
  const car = document.getElementById('carousel');
  const cards = [...car.children];
  const dots = document.getElementById('dots');
  cards.forEach(() => dots.appendChild(document.createElement('i')));
  const setDot = () => {
    const x = car.scrollLeft + car.clientWidth * 0.3;
    let idx = 0;
    cards.forEach((c, i) => { if (c.offsetLeft - car.offsetLeft <= x) idx = i; });
    if (car.scrollLeft + car.clientWidth >= car.scrollWidth - 4) idx = cards.length - 1;
    [...dots.children].forEach((d, i) => d.classList.toggle('on', i === idx));
  };
  car.addEventListener('scroll', () => requestAnimationFrame(setDot), { passive: true });
  setDot();
  document.querySelectorAll('.arrow').forEach(b => b.addEventListener('click', () => {
    const step = cards[0].getBoundingClientRect().width + 16;
    car.scrollBy({ left: step * Number(b.dataset.dir), behavior: 'smooth' });
  }));

  // Burbuja (solo escritorio): una vez, a los 8 s
  const bubble = document.getElementById('bubble');
  let seen = false;
  try { seen = sessionStorage.getItem('fmf-bubble') === '1'; } catch (_) {}
  if (!seen && matchMedia('(min-width: 768px)').matches) {
    setTimeout(() => { bubble.hidden = false; }, 8000);
  }
  document.getElementById('bubbleX').addEventListener('click', () => {
    bubble.hidden = true;
    try { sessionStorage.setItem('fmf-bubble', '1'); } catch (_) {}
  });
})();
