/* Apple 제품 페이지식 스크롤 연출
   1) 큰 제목: 줄 단위 마스크 리빌   2) 본문: 스크롤에 따라 단어가 밝아짐
   3) 단계(flowline): 스크롤에 따라 순서대로 켜짐   4) 이미지·카드: 시차 이동 + 확대 */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var vh = window.innerHeight;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // 1) 제목 줄 마스크 리빌
  document.querySelectorAll('.display, .display-md').forEach(function (h) {
    var parts = h.innerHTML.split(/<br\s*\/?>/i);
    h.innerHTML = parts.map(function (p, i) { return '<span class="ln"><span style="--li:' + i + '">' + p + '</span></span>'; }).join('');
  });

  // 2) 본문 단어 단위 하이라이트(히어로·카드·고지 박스 제외)
  var scrub = [];
  document.querySelectorAll('section:not(.hero) .wrap > .body.reveal, section:not(.hero) .wrap-wide > .body.reveal').forEach(function (el) {
    if (el.textContent.trim().length < 40) return;
    var words = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          if (!n.nodeValue.trim()) return;
          var frag = document.createDocumentFragment();
          n.nodeValue.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(t)); return; }
            var s = document.createElement('span'); s.className = 'w'; s.textContent = t; frag.appendChild(s); words.push(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(el);
    if (words.length) scrub.push({ el: el, words: words });
  });

  // 3) flowline 순차 점등
  var flows = Array.prototype.map.call(document.querySelectorAll('.flowline'), function (el) {
    var items = Array.prototype.slice.call(el.children);
    items.forEach(function (i) { i.style.transitionDelay = '0s'; });
    return { el: el, items: items };
  });

  // 4) 시차 이동·확대
  var par = [];
  // 배너·사진·표는 스크롤 중에도 같은 크기·모양을 유지(확대·이동 효과 없음)
  // 폰 화면 3장은 서로 어긋나 보이지 않게 시차 이동을 쓰지 않음

  var ticking = false;
  function update() {
    ticking = false; vh = window.innerHeight;
    scrub.forEach(function (s) {
      var r = s.el.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) return;
      var p = clamp((vh * 0.92 - r.top) / (vh * 0.5 + r.height * 0.4), 0, 1);
      var n = s.words.length, x = p * (n + 6);
      for (var i = 0; i < n; i++) s.words[i].style.opacity = (0.2 + 0.8 * clamp(x - i, 0, 1)).toFixed(2);
    });
    flows.forEach(function (f) {
      var r = f.el.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) return;
      var p = clamp((vh * 0.85 - r.top) / (vh * 0.45), 0, 1), n = f.items.length;
      f.items.forEach(function (it, i) {
        var on = p * n > i + 0.15;
        it.style.opacity = on ? '1' : '.32';
        it.style.scale = on ? '1.03' : '.97';
      });
    });
    par.forEach(function (o) {
      var r = o.el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var mid = r.top + r.height / 2 - vh / 2;
      if (o.k) o.el.style.translate = '0 ' + (mid * o.k).toFixed(1) + 'px';
      if (o.zoom) o.el.style.scale = (0.9 + 0.1 * clamp((vh * 0.98 - r.top) / (vh * 0.7), 0, 1)).toFixed(3);
    });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
