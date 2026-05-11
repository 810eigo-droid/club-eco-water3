/* =========================================================
   script.js
   役割：スクロール時のフェードイン演出
        画像がふわっと表示される動きをコントロール
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- スクロール時のフェードイン ---- */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // 一度表示したら監視解除
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    // フォールバック：IntersectionObserver非対応の古いブラウザ
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }


  /* ---- アンカーリンクのスムーズスクロール ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const href = a.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
