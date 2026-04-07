(() => {
  const BRAND_HIDE_DELAY_MS = 430;
  const DESKTOP_PAIR_BREAKPOINT = 1120;
  const headers = document.querySelectorAll('.site-header');

  headers.forEach((header) => {
    const toggle = header.querySelector('.menu-toggle');
    const menu = header.querySelector('.menu');
    const brand = header.querySelector('.brand');
    if (!toggle || !menu) return;

    let openTimer = null;

    const clearOpenTimer = () => {
      if (openTimer) {
        window.clearTimeout(openTimer);
        openTimer = null;
      }
    };

    const closeMenu = () => {
      clearOpenTimer();
      header.classList.remove('menu-opening');
      header.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
      clearOpenTimer();
      header.classList.remove('menu-open');
      header.classList.add('menu-opening');
      toggle.setAttribute('aria-expanded', 'true');

      openTimer = window.setTimeout(() => {
        if (!header.classList.contains('menu-opening')) return;
        header.classList.remove('menu-opening');
        header.classList.add('menu-open');
        openTimer = null;
      }, BRAND_HIDE_DELAY_MS);
    };

    const isMenuVisible = () => {
      return header.classList.contains('menu-opening') || header.classList.contains('menu-open');
    };

    toggle.addEventListener('click', () => {
      if (isMenuVisible()) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeMenu());
    });

    document.addEventListener('click', (event) => {
      if (!header.contains(event.target)) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });

    if (brand) {
      brand.addEventListener('click', () => {
        const homeLink = menu.querySelector('a[href*="index.html"]');
        if (homeLink) {
          closeMenu();
          window.location.href = homeLink.getAttribute('href');
        }
      });
    }
  });

  const syncPairHeight = (containerSelector, textSelector, mediaSelector) => {
    document.querySelectorAll(containerSelector).forEach((container) => {
      const textBlock = container.querySelector(textSelector);
      const mediaBlock = container.querySelector(mediaSelector);
      if (!textBlock || !mediaBlock) return;

      // Reset before re-measure.
      mediaBlock.style.height = '';
      mediaBlock.style.width = '';

      if (window.innerWidth <= DESKTOP_PAIR_BREAKPOINT) return;

      const textHeight = Math.ceil(textBlock.getBoundingClientRect().height);
      if (textHeight > 0) {
        const mediaImage = mediaBlock.querySelector('img');
        const naturalRatio =
          mediaImage && mediaImage.naturalWidth > 0 && mediaImage.naturalHeight > 0
            ? mediaImage.naturalWidth / mediaImage.naturalHeight
            : null;

        mediaBlock.style.height = `${textHeight}px`;

        if (naturalRatio) {
          mediaBlock.style.width = `${Math.round(textHeight * naturalRatio)}px`;
        }
      }
    });
  };

  const syncDesktopMediaHeights = () => {
    syncPairHeight('.hero', '.hero-card', '.hero-media');
    syncPairHeight('.about-layout', '.page-card', '.about-image');
  };

  const requestSync = () => {
    window.requestAnimationFrame(syncDesktopMediaHeights);
  };

  window.addEventListener('load', requestSync);
  window.addEventListener('resize', requestSync);
  document.querySelectorAll('.hero-media img, .about-image img').forEach((img) => {
    if (!img.complete) {
      img.addEventListener('load', requestSync);
    }
  });
  requestSync();

})();
