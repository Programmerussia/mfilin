(() => {
  const headers = document.querySelectorAll('.site-header');

  headers.forEach((header) => {
    const toggle = header.querySelector('.menu-toggle');
    const menu = header.querySelector('.menu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      header.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', () => {
      setOpen(!header.classList.contains('menu-open'));
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('click', (event) => {
      if (!header.contains(event.target)) {
        setOpen(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        setOpen(false);
      }
    });
  });

  const carousels = document.querySelectorAll('.js-carousel');

  carousels.forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const dots = Array.from(carousel.querySelectorAll('.carousel-dots button'));
    const prevButton = carousel.querySelector('.carousel-nav.prev');
    const nextButton = carousel.querySelector('.carousel-nav.next');
    if (!slides.length || !prevButton || !nextButton) return;

    let current = slides.findIndex((slide) => slide.classList.contains('is-active'));
    if (current < 0) current = 0;
    let timerId = null;

    const render = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    const next = () => render(current + 1);
    const prev = () => render(current - 1);

    const restartAutoplay = () => {
      if (timerId) window.clearInterval(timerId);
      timerId = window.setInterval(next, 4600);
    };

    nextButton.addEventListener('click', () => {
      next();
      restartAutoplay();
    });

    prevButton.addEventListener('click', () => {
      prev();
      restartAutoplay();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        render(index);
        restartAutoplay();
      });
    });

    carousel.addEventListener('mouseenter', () => {
      if (timerId) window.clearInterval(timerId);
    });

    carousel.addEventListener('mouseleave', () => {
      restartAutoplay();
    });

    render(current);
    restartAutoplay();
  });
})();
