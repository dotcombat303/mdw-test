(function () {
  var container = document.querySelector('[data-constellation]');
  if (!container) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isDesktop = window.matchMedia('(min-width: 901px)').matches;
  if (!isDesktop || prefersReducedMotion) return;

  var items = Array.prototype.slice.call(container.querySelectorAll('[data-item]'));
  if (!items.length) return;

  var svg = container.querySelector('[data-constellation-lines]');

  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var particles = items.map(function (el, i) {
    var rand = mulberry32(1000 + i * 97);
    return {
      el: el,
      radiusX: 40 + rand() * 60,
      radiusY: 30 + rand() * 45,
      speed: 0.35 + rand() * 0.3,
      phase: rand() * Math.PI * 2,
      spin: rand() < 0.5 ? -1 : 1,
      anchorPx: { x: 0, y: 0 },
      curPx: { x: 0, y: 0 }
    };
  });

  function readAnchorPercent(el) {
    var cs = getComputedStyle(el);
    return {
      x: parseFloat(cs.getPropertyValue('--anchor-x')) || 50,
      y: parseFloat(cs.getPropertyValue('--anchor-y')) || 50
    };
  }

  function measure() {
    var w = container.clientWidth;
    var h = container.clientHeight;
    particles.forEach(function (p) {
      var pct = readAnchorPercent(p.el);
      p.anchorPx.x = (pct.x / 100) * w;
      p.anchorPx.y = (pct.y / 100) * h;
    });
  }

  function buildPairs() {
    var pairs = [];
    var seen = {};
    particles.forEach(function (p, i) {
      var distances = particles
        .map(function (q, j) { return { j: j, d: Math.hypot(p.anchorPx.x - q.anchorPx.x, p.anchorPx.y - q.anchorPx.y) }; })
        .filter(function (e) { return e.j !== i; })
        .sort(function (a, b) { return a.d - b.d; });
      distances.slice(0, 2).forEach(function (e) {
        var key = i < e.j ? i + '-' + e.j : e.j + '-' + i;
        if (!seen[key]) { seen[key] = true; pairs.push([i, e.j]); }
      });
    });
    return pairs;
  }

  measure();
  var pairs = buildPairs();

  var ns = 'http://www.w3.org/2000/svg';
  var lineEls = pairs.map(function () {
    var line = document.createElementNS(ns, 'line');
    svg.appendChild(line);
    return line;
  });

  window.addEventListener('resize', function () { measure(); });

  var paused = false;
  var elapsed = 0;
  var lastFrame = null;

  function tick(now) {
    if (lastFrame === null) lastFrame = now;
    var dt = (now - lastFrame) / 1000;
    lastFrame = now;

    if (!paused) {
      elapsed += dt;
      particles.forEach(function (p) {
        var angle = p.phase + elapsed * p.speed * p.spin;
        var x = Math.cos(angle) * p.radiusX;
        var y = Math.sin(angle) * p.radiusY;
        p.el.style.transform = 'translate(-50%, -50%) translate(' + x.toFixed(2) + 'px, ' + y.toFixed(2) + 'px)';
        p.curPx.x = p.anchorPx.x + x;
        p.curPx.y = p.anchorPx.y + y;
      });
      pairs.forEach(function (pair, idx) {
        var a = particles[pair[0]].curPx;
        var b = particles[pair[1]].curPx;
        var line = lineEls[idx];
        line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
        line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
      });
    }
    requestAnimationFrame(tick);
  }

  container.addEventListener('mouseenter', function () { paused = true; });
  container.addEventListener('mouseleave', function () { paused = false; });
  container.addEventListener('focusin', function () { paused = true; });
  container.addEventListener('focusout', function () { paused = false; });

  requestAnimationFrame(tick);
})();