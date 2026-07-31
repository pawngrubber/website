// pawngrubber.com — site shell scripts
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---- theme toggle ---- */
  var toggle = document.getElementById('theme-toggle');

  function paintToggle() {
    if (!toggle) return;
    var dark = root.getAttribute('data-theme') !== 'light';
    toggle.textContent = dark ? '◐' : '◑';
    toggle.setAttribute('title', dark ? 'Switch to light' : 'Switch to dark');
    toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  paintToggle();

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('pg-theme', next); } catch (e) {}
      paintToggle();
    });
  }

  /* ---- mobile nav ---- */
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();
