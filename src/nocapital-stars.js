/* 히어로 배경: 반짝이며 천천히 흐르는 별 + 가끔 지나가는 별똥별 (canvas, 외부 파일 없음)
   - 화면 밖/다른 탭이면 멈춤, 모션 줄이기 설정이면 정지 화면 1장만 그림, 폰에서는 별 수를 줄임 */
(function () {
  var hero = document.querySelector('.hero');
  if (!hero || hero.querySelector('.hero-stars')) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var c = document.createElement('canvas');
  c.className = 'hero-stars'; c.setAttribute('aria-hidden', 'true');
  hero.insertBefore(c, hero.firstChild);
  var ctx = c.getContext('2d');
  if (!ctx) return;

  var w = 0, h = 0, stars = [], shoot = null, nextShoot = 0, raf = 0, last = 0, visible = true, t0 = performance.now();
  var GOLD = '142,235,250', WHITE = '255,255,255';

  function rand(a, b) { return a + Math.random() * (b - a); }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = hero.clientWidth; h = hero.clientHeight;
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    c.style.width = w + 'px'; c.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(210, (w * h) / 6200) * (w < 600 ? 0.65 : 1));
    stars = [];
    for (var i = 0; i < n; i++) {
      var big = Math.random() < 0.12;
      stars.push({
        x: Math.random() * w, y: Math.random() * h,
        r: big ? rand(1.8, 2.8) : rand(0.7, 1.6),
        vx: rand(-0.03, 0.03), vy: rand(-0.09, -0.02),   // 천천히 위로 흐름(크기 큰 별이 조금 더 빠름)
        tw: rand(0.6, 2.2), ph: rand(0, 6.283),           // 반짝임 속도·위상
        col: Math.random() < 0.35 ? GOLD : WHITE, big: big
      });
    }
    if (reduce) draw(0);
  }

  function draw(now) {
    ctx.clearRect(0, 0, w, h);
    var t = (now - t0) / 1000;
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var a = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.tw + s.ph));
      if (s.big) {
        var g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
        g.addColorStop(0, 'rgba(' + s.col + ',' + (a * 1).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(' + s.col + ',0)');
        ctx.fillStyle = g; ctx.fillRect(s.x - s.r * 6, s.y - s.r * 6, s.r * 12, s.r * 12);
      } else {
        ctx.fillStyle = 'rgba(' + s.col + ',' + (a * 1).toFixed(3) + ')';
        ctx.fillRect(s.x - s.r / 2, s.y - s.r / 2, s.r, s.r);
      }
    }
    if (shoot) {
      var p = (now - shoot.t) / shoot.d;
      if (p >= 1) { shoot = null; }
      else {
        var x = shoot.x + shoot.dx * p, y = shoot.y + shoot.dy * p, L = 90;
        var ux = shoot.dx / shoot.len, uy = shoot.dy / shoot.len;
        var g2 = ctx.createLinearGradient(x, y, x - ux * L, y - uy * L);
        var al = Math.sin(p * Math.PI);
        g2.addColorStop(0, 'rgba(204,251,241,' + (0.9 * al).toFixed(3) + ')');
        g2.addColorStop(1, 'rgba(204,251,241,0)');
        ctx.strokeStyle = g2; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - ux * L, y - uy * L); ctx.stroke();
      }
    }
  }

  function step(dt) {
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i], k = s.big ? 1.6 : 1;
      s.x += s.vx * k * dt; s.y += s.vy * k * dt;
      if (s.y < -4) { s.y = h + 4; s.x = Math.random() * w; }
      if (s.x < -4) s.x = w + 4; else if (s.x > w + 4) s.x = -4;
    }
  }

  function frame(now) {
    raf = 0;
    if (!visible || document.hidden) return;
    if (now - last >= 33) {                      // 약 30fps로 제한해 부담 줄임
      var dt = Math.min(64, now - last) / 16.7; last = now;
      step(dt);
      if (!shoot && now > nextShoot) {
        var fromLeft = Math.random() < 0.5, sx = fromLeft ? rand(0, w * 0.5) : rand(w * 0.5, w);
        var dx = (fromLeft ? 1 : -1) * rand(220, 360), dy = rand(90, 170);
        shoot = { x: sx, y: rand(0, h * 0.4), dx: dx, dy: dy, len: Math.sqrt(dx * dx + dy * dy), t: now, d: rand(700, 1000) };
        nextShoot = now + rand(6000, 11000);
      }
      draw(now);
    }
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!reduce && !raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } }

  resize();
  if (reduce) return;
  nextShoot = performance.now() + 2500;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) start(); }, { threshold: 0 }).observe(hero);
  }
  document.addEventListener('visibilitychange', start);
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(resize, 150); });
  start();
})();
