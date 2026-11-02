/* Variant 2 · Ground — the page's only script (deferred).
   1. Mobile menu: full-screen overlay, focus trap, Escape closes, body scroll locked, focus returns to the button.
   2. Keeps ?stories=screens on the language switch so both languages show the same testimonial treatment.
   3. Forms are front-end only until the Mailchimp actions exist (TODO: Mailchimp). */
(function () {
  var root = document.documentElement;

  // 2 · stories state follows the language switch
  if (root.getAttribute('data-stories') === 'screens') {
    document.querySelectorAll('[data-lang-switch]').forEach(function (a) {
      a.setAttribute('href', a.getAttribute('href') + '?stories=screens');
    });
  }

  // 3 · forms: validate in the browser, then stay on the page
  document.querySelectorAll('form[data-front-end-only]').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); });
  });

  // 1 · mobile menu
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('v2-menu');
  if (!btn || !menu) return;
  var closeBtn = menu.querySelector('.menu-close');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var behind = Array.prototype.slice.call(document.querySelectorAll('.v2 > header, .v2 > main, .v2 > footer'));
  var hideTimer = null;

  function focusables() {
    return Array.prototype.slice.call(menu.querySelectorAll('a[href], button:not([disabled])'));
  }
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(true); return; }
    if (e.key !== 'Tab') return;
    var f = focusables(); var first = f[0]; var last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function open() {
    clearTimeout(hideTimer);
    menu.hidden = false;
    void menu.offsetWidth;                 // let the opacity transition start from 0
    menu.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    root.classList.add('menu-open');       // body scroll lock
    behind.forEach(function (el) { el.inert = true; });
    document.addEventListener('keydown', onKey);
    closeBtn.focus();
  }
  function close(returnFocus) {
    if (menu.hidden) return;
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    root.classList.remove('menu-open');
    behind.forEach(function (el) { el.inert = false; });
    document.removeEventListener('keydown', onKey);
    if (reduce.matches) menu.hidden = true;
    else hideTimer = setTimeout(function () { menu.hidden = true; }, 200);
    if (returnFocus) btn.focus();
  }
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', function () { close(true); });
  // in-page links close the menu and let the browser scroll to the section
  menu.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (a) close(false);
  });
  window.matchMedia('(min-width: 1181px)').addEventListener('change', function (e) {
    if (e.matches) close(false);
  });
})();
