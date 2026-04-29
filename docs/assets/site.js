(() => {
  const doc = document.documentElement;
  const progressBar = document.getElementById("progressBar");
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const revealEls = [...document.querySelectorAll('.reveal')];
  const yearEl = document.getElementById('year');
  const cards = [...document.querySelectorAll('.card')];
  yearEl.textContent = new Date().getFullYear();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateProgress(){
    const scrollTop = window.scrollY || doc.scrollTop;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const p = (scrollTop / max) * 100;
    progressBar.style.width = p.toFixed(2) + '%';
    doc.style.setProperty('--scroll', (scrollTop * 0.04).toFixed(2));
  }

  function setCursorGlow(x, y){
    doc.style.setProperty('--mx', x + 'px');
    doc.style.setProperty('--my', y + 'px');
  }

  window.addEventListener('mousemove', (e) => setCursorGlow(e.clientX, e.clientY), { passive:true });
  setCursorGlow(window.innerWidth * .65, window.innerHeight * .3);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach((el) => observer.observe(el));

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === id));
    });
  }, { threshold: 0.46 });
  sections.forEach((section) => navObserver.observe(section));

  const bars = [...document.querySelectorAll('.skill-bar')];
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      const fill = bar.querySelector('.fill');
      const target = Number(bar.dataset.fill || 0);
      requestAnimationFrame(() => { fill.style.width = target + '%'; });
      barObserver.unobserve(bar);
    });
  }, { threshold: .25 });
  bars.forEach((bar) => barObserver.observe(bar));

  const smoothLinks = [...document.querySelectorAll('a[href^="#"]')];
  smoothLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo({ top: y, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  cards.forEach((card) => card.classList.add('modern-parallax'));

  const tiltNodes = [...document.querySelectorAll('[data-tilt]')];
  tiltNodes.forEach((node) => {
    if (window.matchMedia('(pointer: coarse)').matches || prefersReduced) return;
    let raf = 0;
    node.addEventListener('mousemove', (e) => {
      const rect = node.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rx = (py - .5) * -8;
        const ry = (px - .5) * 10;
        node.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
    });
    node.addEventListener('mouseleave', () => {
      node.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    });
  });

  window.addEventListener('scroll', updateProgress, { passive:true });
  updateProgress();
})();
