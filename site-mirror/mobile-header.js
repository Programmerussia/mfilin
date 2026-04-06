(function () {
  var mobileMq = window.matchMedia('(max-width: 900px)');
  if (!mobileMq.matches) return;

  function createHeader() {
    if (document.getElementById('mf-mobile-header')) return;

    var header = document.createElement('div');
    header.id = 'mf-mobile-header';
    header.className = 'mf-mobile-header';

    header.innerHTML =
      '<div class="mf-mobile-header-row">' +
        '<div class="mf-mobile-brand">Maria Filinski</div>' +
        '<button type="button" class="mf-mobile-toggle" aria-expanded="false" aria-controls="mf-mobile-menu" aria-label="Open menu">' +
          '<span class="mf-mobile-toggle-line"></span>' +
          '<span class="mf-mobile-toggle-line"></span>' +
          '<span class="mf-mobile-toggle-line"></span>' +
        '</button>' +
      '</div>' +
      '<nav id="mf-mobile-menu" class="mf-mobile-menu" aria-hidden="true">' +
        '<a href="/home2/">HOME</a>' +
        '<a href="/portfolio/">PORTFOLIO</a>' +
        '<a href="/%C3%BCber-mich/">ÜBER MICH</a>' +
        '<a href="/kontakt/">KONTAKT</a>' +
      '</nav>';

    document.body.classList.add('mf-mobile-header-enabled');
    document.body.appendChild(header);

    var toggle = header.querySelector('.mf-mobile-toggle');
    var menu = header.querySelector('#mf-mobile-menu');

    function setOpen(open) {
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    setOpen(false);

    toggle.addEventListener('click', function () {
      setOpen(!header.classList.contains('is-open'));
    });

    menu.addEventListener('click', function (e) {
      var target = e.target;
      if (target && target.tagName === 'A') {
        setOpen(false);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createHeader, { once: true });
  } else {
    createHeader();
  }
})();
