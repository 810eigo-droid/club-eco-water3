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


  /* ---- PCのみ：スクロール位置に応じてbody背景を切替 ---- */
  /* 01〜05 → bg1 / 06〜10 → bg2 / 11〜16 → bg3 */
  function setupScrollBackground() {
    // スマホサイズなら何もしない
    if (window.innerWidth < 768) return;

    const group2Sections = ['sec-06', 'sec-07', 'sec-08', 'sec-09', 'sec-10'];
    const group3Sections = ['sec-11', 'sec-12', 'sec-13', 'sec-14', 'sec-15', 'sec-16'];

    // 各セクションのDOM要素を取得
    const group2Elements = group2Sections
      .map(cls => document.querySelector('.' + cls))
      .filter(el => el !== null);
    const group3Elements = group3Sections
      .map(cls => document.querySelector('.' + cls))
      .filter(el => el !== null);

    if (group2Elements.length === 0 && group3Elements.length === 0) return;

    const body = document.body;

    // どのグループに属するかチェック
    function updateBackground() {
      const triggerY = window.innerHeight * 0.35; // 画面上から35%地点で判定

      // どのセクションが画面の上部に来ているかチェック
      let currentGroup = 1;

      // group3 のいずれかが画面上部に達していたら group3
      for (const el of group3Elements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerY) {
          currentGroup = 3;
        }
      }

      // group3 でなければ group2 をチェック
      if (currentGroup === 1) {
        for (const el of group2Elements) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerY) {
            currentGroup = 2;
          }
        }
      }

      // クラスを更新
      body.classList.remove('bg-group-2', 'bg-group-3');
      if (currentGroup === 2) body.classList.add('bg-group-2');
      else if (currentGroup === 3) body.classList.add('bg-group-3');
    }

    // スクロール時に呼び出し（throttle で軽量化）
    let scrollTicking = false;
    window.addEventListener('scroll', function () {
      if (!scrollTicking) {
        requestAnimationFrame(function () {
          updateBackground();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    });

    // 初期実行
    updateBackground();
  }

  setupScrollBackground();

  // ウィンドウリサイズ時にも対応
  window.addEventListener('resize', function () {
    if (window.innerWidth < 768) {
      document.body.classList.remove('bg-group-2', 'bg-group-3');
    } else {
      setupScrollBackground();
    }
  });

});