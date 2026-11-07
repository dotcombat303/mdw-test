/* mdw.js — two small behaviours. */
(function () {
  'use strict';
  var d = document;

  /* --- announcement: dismiss --- */
  d.querySelectorAll('[data-announce-close]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.closest('.announcement');
      if (box) box.hidden = true;
    });
  });

  /* --- embed frames: switch on from the bar so the page can always be scrolled past them --- */
d.querySelectorAll('.embed').forEach(function (box) {
  var btn = box.querySelector('.embed__toggle');
  var frame = box.querySelector('iframe');
  if (!btn || !frame) return;
  btn.hidden = false;
  box.classList.add('has-gate');
  var set = function (on) {
    box.classList.toggle('is-active', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (on) frame.focus();
  };
  btn.addEventListener('click', function () { set(!box.classList.contains('is-active')); });
  frame.addEventListener('mouseleave', function () { set(false); });   /* pointer leaves the frame */
  d.addEventListener('pointerdown', function (e) {                      /* tap or click anywhere else */
    if (!box.contains(e.target)) set(false);
  });
});

  /* --- home: scatter the floating illustrations and let them drift */
  var layer = d.querySelector('.floaters');
  if (layer) {
    var place = function () {
      var rnd = function (min, max) { return min + Math.random() * (max - min); };
      var box = layer.getBoundingClientRect();
      var avoid = [];
      d.querySelectorAll('.home__list, .home__aside').forEach(function (el) {
        var r = el.getBoundingClientRect();
        avoid.push({ l: r.left - box.left, t: r.top - box.top, r: r.right - box.left, b: r.bottom - box.top });
      });
      var AVOID_CHANCE = 0.96;   /* toward 1 for emptier lists, lower for more overlap */
      layer.querySelectorAll('.floater').forEach(function (img) {
        var w = img.offsetWidth || 100, x = 0, y = 0;
        for (var tries = 0; tries < 25; tries++) {
          x = rnd(0, Math.max(1, box.width - w));
          y = rnd(0, Math.max(1, box.height - w));
          var over = avoid.some(function (r) {
            return x + w > r.l && x < r.r && y + w > r.t && y < r.b;
          });
          if (!over || Math.random() > AVOID_CHANCE) break;
        }
        img.style.left = x.toFixed(0) + 'px';
        img.style.top = y.toFixed(0) + 'px';
        img.style.setProperty('--dx', rnd(-140, 140).toFixed(0) + 'px');
        img.style.setProperty('--dy', rnd(-100, 100).toFixed(0) + 'px');
        img.style.setProperty('--rot', rnd(-25, 25).toFixed(0) + 'deg');
        img.style.setProperty('--dur', rnd(9, 20).toFixed(1) + 's');
        img.style.setProperty('--delay', (-rnd(0, 15)).toFixed(1) + 's');
      });
      layer.classList.add('is-ready');
    };
    if (d.readyState === 'complete') place();
    else window.addEventListener('load', place);
  }
})();


