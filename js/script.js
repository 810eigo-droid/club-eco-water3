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


  /* ---- 紹介コードのタップでコピー ---- */
  const codeBtn = document.getElementById('referralCodeBtn');
  if (codeBtn) {
    codeBtn.addEventListener('click', function () {
      const code = this.dataset.code || this.textContent.trim();
      const showCopied = () => {
        this.classList.add('is-copied');
        setTimeout(() => this.classList.remove('is-copied'), 1800);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(code).then(showCopied).catch(function () {
          // クリップボードAPIが失敗した場合のフォールバック
          fallbackCopy(code, showCopied);
        });
      } else {
        fallbackCopy(code, showCopied);
      }
    });
  }

  function fallbackCopy(text, onSuccess) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      onSuccess && onSuccess();
    } catch (err) {
      console.warn('コピーに失敗しました', err);
    }
    document.body.removeChild(ta);
  }

});