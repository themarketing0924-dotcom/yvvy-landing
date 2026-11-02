/* 스크롤 모션: 순차 등장(stagger) + 히어로 스크롤 연동 + 영상 확대 */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1) 같은 묶음 안의 카드·리스트는 순서대로 0.08초씩 늦게 등장
  var groups = ['.grid', '.flowline', '.pain', '.check', '.chips'];
  groups.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (c, i) {
        c.style.setProperty('--d', (i * 0.08).toFixed(2) + 's');
        if (!c.classList.contains('reveal')) c.classList.add('stagger-item');
      });
      if (!g.classList.contains('reveal')) {
        var io0 = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io0.unobserve(e.target); } });
        }, { threshold: .15 });
        io0.observe(g);
      }
    });
  });

  // 2) 히어로 안의 요소는 위에서부터 순차 등장
  var hero = document.querySelector('.hero');
  if (hero) {
    var i = 0;
    hero.querySelectorAll('.reveal').forEach(function (el) {
      if (el.closest('.chips')) return;
      el.style.setProperty('--d', (i * 0.12).toFixed(2) + 's'); i++;
    });
    hero.querySelectorAll('.badge, .eyebrow, h1, .sub, .body').forEach(function (el) { el.classList.add('scroll-hero'); });
  }

  if (reduce) return;

  // 3) 스크롤 연동: 히어로 텍스트는 살짝 작아지며 위로, 영상은 커지며 등장
  var ticking = false;
  var wrap = document.querySelector('.hero .video-wrap');
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function update() {
    ticking = false;
    if (!hero) return;
    var vh = window.innerHeight;
    var p = clamp(window.scrollY / (vh * 0.7), 0, 1);
    hero.style.setProperty('--hs', (1 - p * 0.07).toFixed(3));
    hero.style.setProperty('--hy', (-p * 36).toFixed(1) + 'px');
    if (wrap) {
      var r = wrap.getBoundingClientRect();
      var t = clamp((vh - r.top) / (vh * 0.75), 0, 1);
      hero.style.setProperty('--vs', (0.9 + 0.1 * t).toFixed(3));
    }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
