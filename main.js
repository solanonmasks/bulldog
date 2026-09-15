/* ==========================================================================
   Bulldog Bag Ltd. — interaction

   Everything that CSS can do on its own (hover states, the nav collapse, the
   headline reveal, the ticker) lives in styles.css. This file only handles
   behaviour that genuinely needs JavaScript:

     1. Header shrink on scroll
     2. Scroll reveals
     3. Stat counters
     4. Mega menu
     5. Mobile menu
     6. Quote form (scope chips + submit)
     7. Newsletter form

   Nothing here gates content visibility — if this file fails to load, the page
   still reads and every link still works.
   ========================================================================== */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DESKTOP_NAV_MIN = 1080; // keep in sync with the media query in styles.css


  /* 1. HEADER SHRINK ------------------------------------------------------ */

  var header = document.querySelector('[data-header]');

  function syncHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();


  /* 2. SCROLL REVEALS ----------------------------------------------------- */

  var revealables = document.querySelectorAll('[data-reveal]');

  if (revealables.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    revealables.forEach(function (el) {
      // Only hide what is still below the fold, so anything already on screen
      // at load stays visible instead of flashing in.
      if (el.getBoundingClientRect().top > window.innerHeight * 0.92) {
        el.classList.add('is-hidden');
      }
      revealObserver.observe(el);
    });
  }


  /* 3. STAT COUNTERS ------------------------------------------------------ */

  var counters = document.querySelectorAll('[data-count]');

  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;

    // Years count up from 60 back, so "1965" reads as a date and not a tally.
    var from = el.hasAttribute('data-count-year') ? Math.max(0, target - 60) : 0;
    var start = performance.now();

    function tick(now) {
      var p = Math.min(1, (now - start) / 1000);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = String(Math.round(from + (target - from) * eased));
      if (p < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  if (counters.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countObserver.unobserve(entry.target);
        runCounter(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { countObserver.observe(el); });
  }


  /* 4. MEGA MENU ---------------------------------------------------------- */

  var mega = document.querySelector('[data-mega]');
  var navItems = document.querySelectorAll('[data-navitem]');
  var megaPanels = document.querySelectorAll('[data-panel]');
  var megaCloseTimer = null;

  function openMega(key) {
    if (window.innerWidth < DESKTOP_NAV_MIN) return;

    megaPanels.forEach(function (panel) {
      panel.classList.toggle('is-active', panel.getAttribute('data-panel') === key);
    });
    navItems.forEach(function (item) {
      item.classList.toggle('is-open', item.getAttribute('data-navitem') === key);
    });
    if (mega) mega.classList.add('is-open');
  }

  function closeMega() {
    if (mega) mega.classList.remove('is-open');
    megaPanels.forEach(function (panel) { panel.classList.remove('is-active'); });
    navItems.forEach(function (item) { item.classList.remove('is-open'); });
  }

  function closeMegaSoon() {
    clearTimeout(megaCloseTimer);
    megaCloseTimer = setTimeout(closeMega, 220);
  }

  function cancelMegaClose() {
    clearTimeout(megaCloseTimer);
  }

  navItems.forEach(function (item) {
    var key = item.getAttribute('data-navitem');
    item.addEventListener('mouseenter', function () { cancelMegaClose(); openMega(key); });
    item.addEventListener('focus', function () { cancelMegaClose(); openMega(key); });
    item.addEventListener('mouseleave', closeMegaSoon);
    item.addEventListener('click', closeMega);
  });

  if (mega) {
    mega.addEventListener('mouseenter', cancelMegaClose);
    mega.addEventListener('mouseleave', closeMegaSoon);
    mega.addEventListener('click', closeMega);
    mega.addEventListener('focusin', cancelMegaClose);
  }

  // Tabbing out of the header entirely closes the panel.
  if (header) {
    header.addEventListener('focusout', function (event) {
      if (!header.contains(event.relatedTarget)) closeMega();
    });
  }


  /* 5. MOBILE MENU -------------------------------------------------------- */

  var burger = document.querySelector('[data-burger]');
  var mobileNav = document.querySelector('[data-mobilenav]');
  var mobileClose = mobileNav ? mobileNav.querySelector('[data-close]') : null;

  function setMobileNav(open) {
    if (!mobileNav) return;
    mobileNav.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');

    if (open && mobileClose) mobileClose.focus();
    if (!open && burger) burger.focus();
  }

  if (burger) burger.addEventListener('click', function () { setMobileNav(true); });
  if (mobileClose) mobileClose.addEventListener('click', function () { setMobileNav(false); });

  if (mobileNav) {
    mobileNav.querySelectorAll('[data-mlink]').forEach(function (link) {
      link.addEventListener('click', function () { setMobileNav(false); });
    });

    // Keep Tab inside the open panel — it covers the whole viewport.
    mobileNav.addEventListener('keydown', function (event) {
      if (event.key !== 'Tab') return;
      var focusable = mobileNav.querySelectorAll('a[href], button');
      if (!focusable.length) return;

      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    if (mobileNav && !mobileNav.hidden) setMobileNav(false);
    closeMega();
  });

  // Resizing up to desktop leaves the mobile panel stranded over the page.
  window.addEventListener('resize', function () {
    if (window.innerWidth >= DESKTOP_NAV_MIN && mobileNav && !mobileNav.hidden) {
      setMobileNav(false);
    }
  });


  /* 6. QUOTE FORM --------------------------------------------------------- */

  var quoteForm = document.querySelector('[data-quote-form]');

  if (quoteForm) {
    var chips = quoteForm.querySelectorAll('[data-chip]');
    var chipValue = quoteForm.querySelector('[data-chip-value]');

    function syncChipValue() {
      if (!chipValue) return;
      var selected = [];
      chips.forEach(function (chip) {
        if (chip.getAttribute('aria-pressed') === 'true') selected.push(chip.textContent.trim());
      });
      chipValue.value = selected.join(', ');
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var pressed = chip.getAttribute('aria-pressed') === 'true';
        chip.setAttribute('aria-pressed', pressed ? 'false' : 'true');
        syncChipValue();
      });
    });

    var submitLabel = quoteForm.querySelector('[data-submit-label]');
    var defaultLabel = submitLabel ? submitLabel.textContent : '';
    var labelTimer = null;

    quoteForm.addEventListener('submit', function (event) {
      // No endpoint is wired up yet, so the form confirms optimistically.
      // Remove this block once action= points at the real quote endpoint.
      event.preventDefault();

      if (!quoteForm.reportValidity()) return;

      syncChipValue();

      if (submitLabel) {
        submitLabel.textContent = 'Thanks — we’ll be in touch';
        clearTimeout(labelTimer);
        labelTimer = setTimeout(function () {
          submitLabel.textContent = defaultLabel;
        }, 3200);
      }
    });
  }


  /* 7. NEWSLETTER FORM ---------------------------------------------------- */

  var subscribeForm = document.querySelector('[data-subscribe-form]');

  if (subscribeForm) {
    subscribeForm.addEventListener('submit', function (event) {
      // Same as above — swap for a real endpoint before launch.
      event.preventDefault();

      if (!subscribeForm.reportValidity()) return;

      var btn = subscribeForm.querySelector('[data-subscribe-btn]');
      if (btn) {
        btn.innerHTML = '✓';
        btn.setAttribute('aria-label', 'Subscribed');
      }
    });
  }

})();
