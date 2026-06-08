(() => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Optional: set event date/time placeholders if user wants to edit.
  // Keep as-is if placeholders are okay.

  const gallery = document.querySelector('[data-gallery]');
  if (!gallery) return;

  const slidesWrap = gallery;
  const slides = Array.from(slidesWrap.querySelectorAll('[data-slide]'));
  const btnPrev = document.querySelector('.gallery__nav--prev');
  const btnNext = document.querySelector('.gallery__nav--next');
  const dotsWrap = document.querySelector('[data-dots]');
  const btnPlay = document.getElementById('btnPlay');
  const btnShuffle = document.getElementById('btnShuffle');

  let index = 0;
  let autoPlay = true;
  let timer = null;

  const setActive = (newIndex) => {
    index = (newIndex + slides.length) % slides.length;

    slides.forEach((s, i) => {
      s.classList.toggle('is-active', i === index);
    });

    if (dotsWrap) {
      const dots = Array.from(dotsWrap.querySelectorAll('.dot'));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    }
  };

  const buildDots = () => {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'dot' + (i === index ? ' is-active' : '');
      dot.setAttribute('aria-label', `Pilih slide ${i + 1}`);
      dot.addEventListener('click', () => {
        setActive(i);
        if (autoPlay) restartAuto();
      });
      dotsWrap.appendChild(dot);
    });
  };

  const goPrev = () => {
    setActive(index - 1);
    restartAuto();
  };

  const goNext = () => {
    setActive(index + 1);
    restartAuto();
  };

  const restartAuto = () => {
    if (!autoPlay) return;
    stopAuto();
    startAuto();
  };

  const startAuto = () => {
    stopAuto();
    timer = setInterval(() => setActive(index + 1), 3500);
  };

  const stopAuto = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  const setAutoButton = () => {
    if (!btnPlay) return;
    btnPlay.textContent = `Putar otomatis: ${autoPlay ? 'ON' : 'OFF'}`;
  };

  const shuffleSlides = () => {
    // Randomize DOM order for a fresh sequence.
    const active = slides[index];
    const imgs = Array.from(slidesWrap.querySelectorAll('[data-slide]'));

    for (let i = imgs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
    }

    // Re-append to change order
    imgs.forEach((el) => slidesWrap.appendChild(el));

    const updatedSlides = Array.from(slidesWrap.querySelectorAll('[data-slide]'));
    // Update reference
    slides.splice(0, slides.length, ...updatedSlides);

    index = 0;
    setActive(0);
    buildDots();
    restartAuto();
  };

  // Swipe support (mobile)
  let touchStartX = null;
  let touchStartY = null;
  gallery.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }, { passive: true });

  gallery.addEventListener('touchend', (e) => {
    if (touchStartX === null || touchStartY === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;

    // Only treat horizontal swipe
    if (Math.abs(dx) > 40 && Math.abs(dy) < 80) {
      if (dx < 0) goNext();
      else goPrev();
    }

    touchStartX = null;
    touchStartY = null;
  }, { passive: true });

  if (btnPrev) btnPrev.addEventListener('click', goPrev);
  if (btnNext) btnNext.addEventListener('click', goNext);

  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      autoPlay = !autoPlay;
      setAutoButton();
      if (autoPlay) startAuto();
      else stopAuto();
    });
  }

  if (btnShuffle) {
    btnShuffle.addEventListener('click', () => {
      shuffleSlides();
    });
  }

  // Dots + initial state
  buildDots();
  setActive(0);
  setAutoButton();
  if (autoPlay) startAuto();
})();

