// Sticky-note dismiss button. The ticker needs no JS at all.
document.addEventListener('DOMContentLoaded', function () {
  var sticky = document.querySelector('[data-announcement-sticky]');
  if (!sticky) return;
  var closeBtn = sticky.querySelector('[data-announcement-close]');
  if (!closeBtn) return;
  closeBtn.addEventListener('click', function () {
    sticky.setAttribute('hidden', '');
  });
});
