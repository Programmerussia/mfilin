(() => {
  const state = window.__PRELOADED_STATE__ || {};

  function collectMediaMap() {
    const map = new Map();

    function addMediaList(list) {
      if (!Array.isArray(list)) return;
      for (const item of list) {
        if (!item || !item.hash || !item.name) continue;
        if (item.is_video) continue;
        map.set(item.hash, item);
      }
    }

    function addFromCollection(collection) {
      if (!collection || typeof collection !== 'object') return;
      for (const entry of Object.values(collection)) {
        if (!entry || typeof entry !== 'object') continue;
        addMediaList(entry.media);
      }
    }

    addFromCollection(state.pages && state.pages.byId);
    addFromCollection(state.sets && state.sets.byId);

    return map;
  }

  const mediaMap = collectMediaMap();
  if (!mediaMap.size) return;

  function ensureStyleTag() {
    if (document.getElementById('mf-media-fallback-style')) return;

    const style = document.createElement('style');
    style.id = 'mf-media-fallback-style';
    style.textContent = `
      media-item.mf-fallback-applied > img.mf-fallback-image {
        object-fit: cover;
        border-radius: inherit;
        width: 100%;
        height: 100%;
        display: block;
      }

      media-item.mf-fallback-applied::part(media),
      media-item.mf-fallback-applied::part(video),
      media-item.mf-fallback-applied::part(poster) {
        opacity: 0 !important;
      }
    `;

    document.head.appendChild(style);
  }

  function fileNameToUrlPart(name) {
    return encodeURIComponent(name).replace(/%2F/g, '/');
  }

  function buildSources(info) {
    const name = fileNameToUrlPart(info.name);
    const hash = info.hash;
    return [
      `/freight.cargo.site/w/2000/i/${hash}/${name}`,
      `/freight.cargo.site/w/1500/i/${hash}/${name}`,
      `/freight.cargo.site/w/1250/i/${hash}/${name}`,
      `/freight.cargo.site/w/1000/i/${hash}/${name}`,
      `/freight.cargo.site/w/750/i/${hash}/${name}`,
      `/freight.cargo.site/w/500/i/${hash}/${name}`,
    ];
  }

  function buildSrcSet(info) {
    const name = fileNameToUrlPart(info.name);
    const hash = info.hash;
    const widths = [500, 750, 1000, 1250, 1500, 2000];
    return widths
      .map((w) => `/freight.cargo.site/w/${w}/i/${hash}/${name} ${w}w`)
      .join(', ');
  }

  function applyToMediaItem(el) {
    if (!(el instanceof HTMLElement)) return;
    if (el.classList.contains('mf-fallback-applied')) return;

    const hash = el.getAttribute('hash');
    if (!hash) return;

    const info = mediaMap.get(hash);
    if (!info) return;

    const candidates = buildSources(info);
    if (!candidates.length) return;

    // Keep the home hero image at a visible size even when Cargo falls back to tiny fit-height probes.
    if (hash === 'C2694246974347461885021903101588') {
      const unit = el.closest('column-unit');
      if (unit && window.innerWidth > 900) {
        unit.style.setProperty('width', '24rem', 'important');
        unit.style.setProperty('max-width', '24rem', 'important');
        unit.style.setProperty('flex-basis', '24rem', 'important');
      }
      if (window.innerWidth > 900) {
        el.style.setProperty('display', 'block', 'important');
        el.style.setProperty('width', '24rem', 'important');
        el.style.setProperty('max-width', '24rem', 'important');
        el.style.setProperty('flex-basis', '24rem', 'important');
      } else {
        el.style.setProperty('display', 'block', 'important');
        el.style.setProperty('width', '100%', 'important');
        el.style.setProperty('max-width', '30rem', 'important');
      }
      el.style.setProperty('aspect-ratio', '6192 / 6960', 'important');
    }

    const img = document.createElement('img');
    img.className = 'mf-fallback-image';
    img.setAttribute('slot', 'custom-media');
    img.alt = '';
    const isHero = hash === 'C2694246974347461885021903101588';
    img.loading = isHero ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.fetchPriority = isHero ? 'high' : 'low';
    img.srcset = buildSrcSet(info);
    img.sizes = isHero
      ? '(min-width: 901px) 24rem, (min-width: 600px) 70vw, 95vw'
      : '(min-width: 901px) 33vw, 92vw';

    let idx = 0;
    const tryNext = () => {
      if (idx >= candidates.length) return;
      img.src = candidates[idx++];
    };

    img.addEventListener('error', tryNext);
    img.addEventListener('load', () => {
      el.setAttribute('data-mf-fallback-loaded', '1');
    });

    el.classList.add('mf-fallback-applied');
    el.appendChild(img);
    tryNext();
  }

  function applyAll() {
    ensureStyleTag();
    const items = document.querySelectorAll('media-item[hash]');
    items.forEach(applyToMediaItem);
  }

  let rafId = 0;
  function scheduleApply() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      applyAll();
      rafId = 0;
    });
  }

  const observer = new MutationObserver(scheduleApply);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  window.addEventListener('load', () => {
    scheduleApply();
    setTimeout(scheduleApply, 300);
    setTimeout(scheduleApply, 1200);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleApply, { once: true });
  } else {
    scheduleApply();
  }
})();
