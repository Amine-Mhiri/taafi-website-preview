/* Variant 1 · Presence — page behaviour (EN + AR).
   The ?stories= switch itself runs inline in <head> so the right treatment paints first;
   this file adds the mobile menu, keeps the stories state on the language switch,
   and holds the newsletter form on the page until Mailchimp is connected. */
(() => {
  const root = document.documentElement;

  /* ---- mobile menu: overlay, focus trap, Escape, scroll lock ---- */
  const btn = document.querySelector('.menu-btn');
  const menu = document.getElementById('v1-menu');
  const page = document.querySelector('.page');
  if (btn && menu) {
    const closeBtn = menu.querySelector('.mnav-close');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const focusables = () => [...menu.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])')]
      .filter((el) => el.getClientRects().length > 0);
    let hideTimer;

    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !menu.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !menu.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    };

    function open() {
      clearTimeout(hideTimer);
      menu.hidden = false;
      void menu.offsetWidth; // flush styles so the fade runs
      menu.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      root.classList.add('menu-open');
      if (page) page.inert = true;
      document.addEventListener('keydown', onKey);
      closeBtn.focus();
    }

    function close(returnFocus = true) {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      root.classList.remove('menu-open');
      if (page) page.inert = false;
      document.removeEventListener('keydown', onKey);
      const hide = () => { menu.hidden = true; };
      if (reduce.matches) hide(); else hideTimer = setTimeout(hide, 200);
      if (returnFocus) btn.focus();
    }

    btn.addEventListener('click', open);
    closeBtn.addEventListener('click', () => close());
    // a link inside the menu closes it and lets the browser follow the anchor
    menu.addEventListener('click', (e) => { if (e.target.closest('a[href^="#"]')) close(false); });
    // growing past the menu breakpoint (rotate, resize) closes it
    window.matchMedia('(min-width: 1181px)').addEventListener('change', (e) => {
      if (e.matches && !menu.hidden) close(false);
    });
  }

  /* ---- keep ?stories=screens when switching language ---- */
  if (root.getAttribute('data-stories') === 'screens') {
    document.querySelectorAll('a[hreflang]').forEach((a) => {
      a.setAttribute('href', `${a.getAttribute('href')}?stories=screens`);
    });
  }

  /* ---- forms are front-end only until the Mailchimp action is supplied ---- */
  document.querySelectorAll('form[action="#"]').forEach((form) => {
    form.addEventListener('submit', (e) => e.preventDefault());
  });
})();
