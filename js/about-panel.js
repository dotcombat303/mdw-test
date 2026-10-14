(function () {
  var panel = document.querySelector('[data-about-panel]');
  if (!panel) return;
  var summary = panel.querySelector('summary');
  var closeBtn = panel.querySelector('[data-about-close]');

  panel.style.transition = 'height 0.25s ease';

  function collapse() {
    panel.style.height = panel.scrollHeight + 'px';
    requestAnimationFrame(function () {
      panel.style.height = summary.scrollHeight + 'px';
    });
    window.setTimeout(function () {
      panel.removeAttribute('open');
      panel.style.height = '';
    }, 250);
  }

  function expand() {
    panel.setAttribute('open', '');
    var target = panel.scrollHeight;
    panel.style.height = summary.scrollHeight + 'px';
    requestAnimationFrame(function () {
      panel.style.height = target + 'px';
    });
    window.setTimeout(function () { panel.style.height = ''; }, 250);
  }

  panel.addEventListener('click', function (e) {
    if (e.target !== summary) return;
    e.preventDefault();
    panel.hasAttribute('open') ? collapse() : expand();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      collapse();
    });
  }
})();