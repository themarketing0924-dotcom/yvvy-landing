/* every page opens at the very top (no restored mid-page scroll) unless a #hash is requested */
(function(){try{if('scrollRestoration' in history)history.scrollRestoration='manual'}catch(e){}
function top(){window.scrollTo({top:0,left:0,behavior:'instant'})}
if(!location.hash){top();addEventListener('load',top);addEventListener('pageshow',function(e){if(e.persisted)top()})}})();

/* Apple 제품 페이지식 추가 스크롤 연출
   - 사진·영상·폰 화면: 화면에 들어오며 살짝 작게 → 본래 크기로 안착(안착 후에는 크기 고정, 폭·모서리는 그대로)
   - 상단바: 스크롤하면 불투명도·그림자 변화
   움직임 줄이기 설정이면 동작 안 함 */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.querySelector('.nav');
  var els = reduce ? [] : Array.prototype.slice.call(document.querySelectorAll('.video-wrap, .cover, .phones figure, .banner, .tbl-wrap')).filter(function (e) { return !e.closest('.hero'); });
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight;
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 24);
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -80 || r.top > vh + 80) return;
      var media = el.matches('.video-wrap, .cover, .phones figure');
      var p = clamp((vh * 0.98 - r.top) / (vh * (media ? 0.8 : 0.55)), 0, 1);   // 0: 막 보이기 시작 → 1: 안착
      var e = 1 - Math.pow(1 - p, 3);
      var from = media ? 0.84 : 0.95;
      if (media) {                                   /* 사진·영상은 안쪽이 글보다 천천히 움직여 깊이감 */
        var inner = el.__in || (el.__in = el.querySelector('img, video') || false);
        if (inner) { var q = clamp((vh - r.top) / (vh + r.height), 0, 1); inner.style.transform = 'translate3d(0,' + ((0.5 - q) * 34).toFixed(1) + 'px,0) scale(1.08)'; }
      }
    });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* 960px 이하: 상단바에 '현재 단계 ▾' 메뉴 버튼 (단계 탭은 눌렀을 때만 펼쳐짐) */
(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;
  function build() {
    var bar = document.querySelector('.fprog');
    if (!bar || nav.querySelector('.nav-menu')) return;
    var cur = bar.querySelector('.cur');
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'nav-menu'; btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', '단계 메뉴');
    btn.innerHTML = '<span>' + (cur ? cur.textContent : '단계') + '</span><i>▾</i>';
    var cta = nav.querySelector('.nav-cta, .pill, a:last-child');
    nav.insertBefore(btn, cta && cta.parentNode === nav ? cta : null);
    btn.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      btn.setAttribute('aria-expanded', open);
    });
    bar.addEventListener('click', function (e) { if (e.target.closest('a')) document.body.classList.remove('menu-open'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') document.body.classList.remove('menu-open'); });
  }
  if (document.querySelector('.fprog')) build(); else window.addEventListener('load', build);
})();

/* 히어로: 헤드카피를 화면 폭에 맞게 키우고(줄이 넘치지 않는 선에서), 서브카피 폭을 가장 긴 줄에 맞춤 */
(function(){
  function lineWidth(t){
    var lines={}, w=document.createTreeWalker(t,NodeFilter.SHOW_TEXT,null), n, max=0;
    while((n=w.nextNode())){
      if(!n.nodeValue.trim()) continue;
      var rg=document.createRange(); rg.selectNodeContents(n);
      var rr=rg.getClientRects();
      for(var i=0;i<rr.length;i++){ var k=Math.round(rr[i].top/6); lines[k]=(lines[k]||0)+rr[i].width; }
    }
    for(var key in lines){ if(lines[key]>max) max=lines[key]; }
    return max;
  }
  function measure(){
    document.querySelectorAll('.hero, section#top').forEach(function(h){
      var t=h.querySelector('h1'); if(!t) return;
      var vw=window.innerWidth, avail=t.clientWidth||h.clientWidth-40;
      /* 1) 줄바꿈 없이 가장 긴 줄의 글자폭(em)을 잰다 */
      var fs0=parseFloat(getComputedStyle(t).fontSize)||48, ws=t.style.whiteSpace;
      t.style.whiteSpace='nowrap';
      var em=lineWidth(t)/fs0; t.style.whiteSpace=ws;
      if(em>0 && avail>0){
        var cap = vw>=1441 ? 92 : (vw>=1024 ? 82 : (vw>=700 ? 74 : Math.min(54, vw*0.13+2)));
        var floor = vw>=700 ? 52 : 40;
        var sc = parseFloat(t.getAttribute('data-fs')) || 1;
        var fs = Math.max(floor*sc, Math.min(cap*sc, avail/em*0.985));
        void fs;
      }
      /* 2) 실제 줄 폭 = 서브카피 폭 */
      var max=lineWidth(t);
      if(max>0){ h.style.setProperty('--hw', Math.max(Math.round(max), 280)+'px'); }
    });
  }
  var tm;
  function later(){ clearTimeout(tm); tm=setTimeout(measure,80); }
  window.addEventListener('resize',later);
  window.addEventListener('orientationchange',later);
  window.addEventListener('load',function(){ measure(); setTimeout(measure,600); });
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(measure);
  document.addEventListener('DOMContentLoaded',measure);
})();

/* hero background video: play only while visible (battery/data friendly) */
(function(){var v=document.querySelector('.hero-bg video');if(!v)return;
  v.muted=true;var p=v.play&&v.play();if(p&&p.catch)p.catch(function(){});
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var q=v.play();if(q&&q.catch)q.catch(function(){})}else v.pause()})},{threshold:0}).observe(v)}
})();

/* 짧은 카드(글자 60자 이하)만 모은 묶음은 모바일에서 2열로 (애플 제품 페이지식) */
(function(){
  document.querySelectorAll('.grid').forEach(function(g){
    var k=Array.prototype.slice.call(g.children); if(k.length<2) return;
    var ok=k.every(function(c){return c.textContent.replace(/\s+/g,' ').trim().length<=60});
    if(ok && k.length%2===0) g.classList.add("duo");
  });
})();

/* ===== 애플식 스크롤 연동(scrub) 등장 =====
   손가락/휠이 움직이는 만큼 진행: 아래에서 위로 올라오며(translate) 서서히 선명해지고(opacity) 안착(scale).
   요소 상단이 화면 92% 지점에 들어올 때 시작 → 64% 지점에서 완료(그 위로는 항상 완전히 보임). 두 번 재생 없음(완료 후 고정).
   사진·영상은 더 크게(0.82→1), 카드는 좌/우에서 살짝 들어옴, 첫 화면은 스크롤하며 천천히 위로 사라짐 */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var vh = innerHeight, wide = innerWidth >= 735;
  var TEXT = 'section:not(.hero) .eyebrow, section:not(.hero) h2, section:not(.hero) .sub, section:not(.hero) .body, section:not(.hero) .wrap > p:not(.fine):not(.small), section:not(.hero) .wrap-wide > p:not(.fine):not(.small)';
  var MEDIA = '.video-wrap, .cover, .phones figure';
  var BOX = '.bz-card, .bz-stat, .banner, .tbl-wrap, .risk, .gate, .next, .grid > .card, .grid > div, details';
  var items = [];
  function add(el, kind, extra) {
    if (el.closest('.hero') || el.closest('nav') || el.__sx) return;
    if (el.getBoundingClientRect().top < vh * 0.9) return;        // 첫 화면에 이미 보이는 것은 그대로
    el.__sx = 1; el.classList.add('sx');
    var o = { el: el, kind: kind, dx: 0, dy: kind === 'text' ? 46 : (kind === 'media' ? (wide ? 110 : 80) : (wide ? 90 : 64)), s0: kind === 'media' ? 0.82 : (kind === 'text' ? 1 : 0.96), a0: kind === 'text' ? 0 : (kind === 'media' ? 0.15 : 0.1), done: false, off: 0 };
    if (extra && extra.dx) o.dx = extra.dx;
    if (extra && extra.off) o.off = extra.off;
    items.push(o);
  }
  document.querySelectorAll(TEXT).forEach(function (e) { add(e, 'text'); });
  document.querySelectorAll(MEDIA).forEach(function (e) { add(e, 'media'); });
  document.querySelectorAll(BOX).forEach(function (e) {
    var p = e.parentElement, dx = 0, off = 0;
    if (p && p.classList.contains('grid')) {
      var cols = getComputedStyle(p).gridTemplateColumns.split(' ').length, i = Array.prototype.indexOf.call(p.children, e);
      if (cols === 2) dx = (i % 2 === 0 ? -1 : 1) * (wide ? 70 : 34);
      else if (cols >= 3) { var c = i % cols; dx = c === 0 ? -50 : (c === cols - 1 ? 50 : 0); }
      off = (cols >= 2 ? (i % cols) : 0) * 0.04;
    }
    add(e, 'box', { dx: dx, off: off });
  });
  var hero = document.querySelector('.hero .wrap-wide, .hero .wrap, section#top .wrap-wide');
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  var tick = false, last = performance.now();
  function update(now) {
    tick = false;
    var dt = Math.min(64, (now || performance.now()) - last); last = now || performance.now();
    var k = 1 - Math.pow(1 - 0.075, dt / 16.67);                   // 느린 감속(부드러운 따라가기)
    var vh2 = innerHeight, maxS = document.documentElement.scrollHeight - vh2, rem = maxS - scrollY, busy = false;
    items.forEach(function (o) {
      if (o.done) return;
      var r = o.el.getBoundingClientRect();
      if (r.top > vh2 * 1.1) return;
      var start = vh2 * (1.0 - o.off), end = vh2 * 0.46;            // 넓은 구간(화면 54%)에 걸쳐 천천히 진행
      var p = clamp((start - r.top) / (start - end), 0, 1);
      if (rem < vh2 * 0.45 && r.top < vh2 * 0.97) p = 1;
      if (r.bottom < 0) { p = 1; o.cur = 1; }
      if (o.cur == null) o.cur = p;
      o.cur += (p - o.cur) * k;
      if (Math.abs(p - o.cur) < 0.002) o.cur = p; else busy = true;
      var e = ease(o.cur);
      var st = o.el.style;
      st.setProperty('--so', (o.a0 + (1 - o.a0) * e).toFixed(3));
      st.setProperty('--sx', ((1 - e) * o.dx).toFixed(1) + 'px');
      st.setProperty('--sy', ((1 - e) * o.dy).toFixed(1) + 'px');
      st.setProperty('--ss', (o.s0 + (1 - o.s0) * e).toFixed(4));
      if (p >= 1 && o.cur >= 1) { o.done = true; o.el.classList.add('sx-done'); }
    });
    if (busy) req();
  }
  function req() { if (!tick) { tick = true; requestAnimationFrame(update); } }
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', function () { vh = innerHeight; req(); });
  update();
})();
