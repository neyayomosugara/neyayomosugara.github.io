(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const intro = document.getElementById('intro');
  if (intro) {
    document.body.classList.add('intro-lock');
    const dismissIntro = () => {
      intro.classList.add('intro-hide');
      document.body.classList.remove('intro-lock');
    };
    intro.addEventListener('click', dismissIntro);
    intro.addEventListener('transitionend', () => { intro.style.display = 'none'; }, { once: true });
    setTimeout(dismissIntro, reduce ? 400 : 1800);
  }

  document.querySelectorAll('[data-year]').forEach((e) => {
    e.textContent = new Date().getFullYear();
  });

  const bar = document.querySelector('[data-progress]');
  if (bar) {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      bar.style.width = ((window.scrollY / max) * 100).toFixed(2) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // dot-matrix wave field behind the hero
  const cv = document.querySelector('[data-dots]');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0, H = 0;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const gap = 26;
    let t = 0;
    const draw = () => {
      t += .02;
      ctx.clearRect(0, 0, W, H);
      for (let y = gap; y < H; y += gap) {
        for (let x = gap; x < W; x += gap) {
          const v = Math.sin(x * 0.012 + t) * Math.cos(y * 0.011 - t * 0.7) * Math.sin((x + y) * 0.004 + t * 0.5);
          const a = Math.max(0, v) * 0.16;
          if (a < 0.01) continue;
          const r = 1 + Math.max(0, v) * 1.6;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = v > 0.82 ? `rgba(232,57,29,${(a + 0.1).toFixed(3)})` : `rgba(13,13,12,${a.toFixed(3)})`;
          ctx.fill();
        }
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }

  // kinetic hero: subtle position/opacity shift on scroll
  const kin = document.querySelector('[data-kinetic]');
  if (kin && !reduce) {
    const onKinetic = () => {
      const p = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
      kin.style.transform = `translateX(${(-p * 30).toFixed(1)}px)`;
      kin.style.opacity = String(1 - p * 0.35);
    };
    window.addEventListener('scroll', onKinetic, { passive: true });
    onKinetic();
  }
})();
