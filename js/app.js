/* =========================================================
   CLUB ECO WATER  LP  /  app.js
   ・スクロールで要素をふわっと表示（reveal）
   ・固定CTAバーをFV通過後に表示
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. reveal（スクロール表示） ---------- */
  // 主要なブロックに .reveal を自動付与してから監視する
  var targets = document.querySelectorAll(
    '.section-eyebrow, .section-title, .section-lead, ' +
    '.fv__eyebrow, .fv__title, .fv__lead, .fv__photo, .fv__cta, ' +
    '.check-list__item, .fact-card, .reality__result, ' +
    '.feature-card, .compare-row, .voice-card, ' +
    '.story__photo, .story__text, .trust-card, ' +
    '.closing__lead, .closing__title, .closing__cta, .closing__referrer, ' +
    '.solution__photo, .empathy__note'
  );

  targets.forEach(function (el, i) {
    el.classList.add('reveal');
    // 同じグループ内の要素を少しずつ遅らせる
    var delay = (i % 5) * 70;
    el.style.transitionDelay = delay + 'ms';
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (el) { io.observe(el); });
  } else {
    // 古いブラウザ：そのまま表示
    targets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 2. 固定CTAバーの表示制御 ---------- */
  var bar = document.querySelector('.floating-bar');
  var fv = document.querySelector('.fv');
  if (bar && fv) {
    bar.style.transform = 'translateY(120%)';
    bar.style.transition = 'transform .35s ease';

    var barIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        // FVが見えている間は隠す／通過したら出す
        bar.style.transform = entry.isIntersecting ? 'translateY(120%)' : 'translateY(0)';
      });
    }, { threshold: 0.15 });
    barIO.observe(fv);
  }

})();
