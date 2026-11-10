/* 히어로 배경: 골드 입자 네트워크(canvas) + 천천히 회전하는 빛 고리. 화면 밖이면 멈추고, 모션 줄이기 설정이면 꺼짐 */
(function () {
  var hero = document.querySelector('.hero');
  if (!hero || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;

  var halo = document.createElement('div'); halo.className = 'hero-halo'; halo.setAttribute('aria-hidden', 'true');
  var c = document.createElement('canvas'); c.className = 'hero-canvas'; c.setAttribute('aria-hidden', 'true');
  hero.insertBefore(c, hero.firstChild); hero.insertBefore(halo, hero.firstChild);

  var ctx = c.getContext('2d'), w = 0, h = 0, pts = [], raf = 0, visible = true, LINK = 130;
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth; h = hero.clientHeight;
    c.width = w * dpr; c.height = h * dpr; c.style.width = w + 'px'; c.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(90, (w * h) / 13000));
    pts = [];
    for (var i = 0; i < n; i++) pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28, r: Math.random() * 1.6 + .6 });
  }
  function frame() {
    raf = 0; if (!visible) return;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i]; p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fillStyle = 'rgba(20,241,149,.85)'; ctx.fill();
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK) { ctx.strokeStyle = 'rgba(20,241,149,' + ((1 - d / LINK) * .32).toFixed(3) + ')'; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
    }
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!raf && visible) raf = requestAnimationFrame(frame); }
  new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) start(); }, { threshold: 0 }).observe(hero);
  var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(resize, 150); });
  resize(); start();
})();
