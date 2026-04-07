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
})();
