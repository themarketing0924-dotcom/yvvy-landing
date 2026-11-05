/* YVVY 시각 요소: 도넛·레이더·꺾은선·링·막대 + 계산기 3종 + 영상 배경 지연 로드
   모든 수치는 백서(19쪽) 값 또는 그 규칙으로 계산한 값입니다. 외부 라이브러리 없음. */
(function () {
  'use strict';
  var PAL = ['#2dd4bf', '#5eead4', '#99f6e4', '#14b8a6', '#0d9488', '#0f766e'];
  document.documentElement.classList.add('yz-js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function J(s, d) { try { return JSON.parse(s); } catch (e) { return d; } }
  function f(n, d) { return (Math.round(n * Math.pow(10, d)) / Math.pow(10, d)).toLocaleString('ko-KR', { maximumFractionDigits: d }); }
  function pt(cx, cy, r, deg) { var a = deg * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }

  /* ---------- 도넛 ---------- */
  function donutSVG(items, center, sub, total) {
    var R = 74, C = 2 * Math.PI * R, sum = total || items.reduce(function (a, b) { return a + b.v; }, 0), off = 0, s = '';
    s += '<svg viewBox="0 0 200 200" role="img" aria-label="' + (center || '') + ' ' + (sub || '') + '"><circle cx="100" cy="100" r="' + R + '" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="22"/>';
    items.forEach(function (it, i) {
      var len = C * it.v / sum, col = it.c || PAL[i % PAL.length];
      s += '<circle class="anim-stroke" data-len="' + len.toFixed(2) + '" data-c="' + C.toFixed(2) + '" cx="100" cy="100" r="' + R + '" fill="none" stroke="' + col + '" stroke-width="22" stroke-dasharray="0 ' + C.toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 100 100)"/>';
      off += len;
    });
    s += '<text class="yz-n" x="100" y="104" text-anchor="middle">' + center + '</text><text class="yz-l" x="100" y="126" text-anchor="middle">' + (sub || '') + '</text></svg>';
    return s;
  }
  function arm(root) { root.querySelectorAll('.anim-stroke[data-len]').forEach(function (c) { c.setAttribute('stroke-dasharray', c.dataset.len + ' ' + (c.dataset.c - c.dataset.len)); }); }
  function legend(items) { return '<div class="yz-leg">' + items.map(function (it, i) { return '<span><i style="background:' + (it.c || PAL[i % PAL.length]) + '"></i>' + it.l + (it.t ? ' ' + it.t : '') + '</span>'; }).join('') + '</div>'; }

  var R = {};
  R.donut = function (el) {
    var items = J(el.dataset.items, []);
    el.innerHTML = '<div class="yz-grid"><div>' + donutSVG(items, el.dataset.center || '', el.dataset.sub || '') + '</div><div><ul class="yz-list">' +
      items.map(function (it, i) { return '<li><span><i style="display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:.5rem;background:' + (it.c || PAL[i % PAL.length]) + '"></i>' + it.l + '</span><b>' + (it.t || it.v + '%') + '</b></li>'; }).join('') + '</ul></div></div>';
  };

  /* ---------- 레이더 ---------- */
  R.radar = function (el) {
    var labels = (el.dataset.labels || '').split('|'), series = J(el.dataset.series, []), max = +el.dataset.max || 100, n = labels.length, cx = 210, cy = 168, r = 100, s = '';
    s += '<svg viewBox="0 0 420 340" role="img" aria-label="' + (el.dataset.alt || '레이더 차트') + '">';
    for (var L = 1; L <= 4; L++) {
      var p = []; for (var i = 0; i < n; i++) { var q = pt(cx, cy, r * L / 4, -90 + i * 360 / n); p.push(q[0].toFixed(1) + ',' + q[1].toFixed(1)); }
      s += '<polygon class="grid-l" points="' + p.join(' ') + '"/>';
    }
    for (i = 0; i < n; i++) {
      var e = pt(cx, cy, r, -90 + i * 360 / n), t = pt(cx, cy, r + 18, -90 + i * 360 / n), cs = Math.cos((-90 + i * 360 / n) * Math.PI / 180);
      s += '<line class="axis-l" x1="' + cx + '" y1="' + cy + '" x2="' + e[0].toFixed(1) + '" y2="' + e[1].toFixed(1) + '"/>';
      s += '<text x="' + t[0].toFixed(1) + '" y="' + (t[1] + 4).toFixed(1) + '" text-anchor="' + (cs > .3 ? 'start' : cs < -.3 ? 'end' : 'middle') + '">' + labels[i] + '</text>';
    }
    series.forEach(function (se, k) {
      var pts = se.v.map(function (v, i) { var q = pt(cx, cy, r * Math.max(v, 0) / max, -90 + i * 360 / n); return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' '), col = se.c || PAL[k];
      s += '<g class="anim-scale" style="--cx:' + cx + 'px;--cy:' + cy + 'px;transition-delay:' + (k * .15) + 's"><polygon points="' + pts + '" fill="' + col + '" fill-opacity="' + (se.o == null ? .18 : se.o) + '" stroke="' + col + '" stroke-width="2" stroke-linejoin="round"' + (se.d ? ' stroke-dasharray="5 4"' : '') + '/>';
      se.v.forEach(function (v, i) { var q = pt(cx, cy, r * Math.max(v, 0) / max, -90 + i * 360 / n); s += '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="3.5" fill="' + col + '"/>'; });
      s += '</g>';
    });
    s += '</svg>';
    el.innerHTML = '<div style="max-width:460px;margin:1rem auto 0">' + s + '</div>' + legend(series.map(function (x, k) { return { l: x.n, c: x.c || PAL[k] }; }));
  };

  /* ---------- 꺾은선 ---------- */
  R.line = function (el) {
    var xs = (el.dataset.x || '').split('|'), ys = (el.dataset.y || '').split(',').map(Number), unit = el.dataset.unit || '', W = 520, H = 250, pl = 40, pr = 18, pt_ = 22, pb = 34, max = +el.dataset.max || Math.max.apply(null, ys);
    function X(i) { return pl + (W - pl - pr) * i / (xs.length - 1); } function Y(v) { return pt_ + (H - pt_ - pb) * (1 - v / max); }
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (el.dataset.alt || '꺾은선 차트') + '">';
    for (var g = 0; g <= 4; g++) { var v = max * g / 4; s += '<line class="grid-l" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '"/><text x="' + (pl - 8) + '" y="' + (Y(v) + 4).toFixed(1) + '" text-anchor="end">' + f(v, 0) + unit + '</text>'; }
    var d = ys.map(function (v, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1); }).join(' ');
    s += '<defs><linearGradient id="lg' + el.id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2dd4bf" stop-opacity=".35"/><stop offset="1" stop-color="#2dd4bf" stop-opacity="0"/></linearGradient></defs>';
    s += '<path class="anim-fade" d="' + d + ' L' + X(ys.length - 1).toFixed(1) + ' ' + Y(0) + ' L' + X(0).toFixed(1) + ' ' + Y(0) + ' Z" fill="url(#lg' + el.id + ')"/>';
    s += '<path class="anim-line" pathLength="1" d="' + d + '" fill="none" stroke="#2dd4bf" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
    ys.forEach(function (v, i) { s += '<g class="anim-fade"><circle cx="' + X(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="4.5" fill="#1d1d1f" stroke="#2dd4bf" stroke-width="2.5"/><text x="' + X(i).toFixed(1) + '" y="' + (Y(v) - 11).toFixed(1) + '" text-anchor="middle" style="fill:#f5f5f7;font-weight:600">' + v + unit + '</text></g><text x="' + X(i).toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle">' + xs[i] + '</text>'; });
    el.innerHTML = '<div style="margin-top:1.2rem">' + s + '</svg></div>';
  };

  /* ---------- 진행 링 ---------- */
  R.rings = function (el) {
    var items = J(el.dataset.items, []), Rr = 46, C = 2 * Math.PI * Rr;
    el.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1.4rem;margin-top:1.6rem;text-align:center">' + items.map(function (it) {
      var len = C * (it.n / it.d), col = it.c || '#2dd4bf';
      return '<div><svg viewBox="0 0 120 120" style="max-width:150px;margin:0 auto" role="img" aria-label="' + it.l + ' ' + it.n + '/' + it.d + '"><circle cx="60" cy="60" r="' + Rr + '" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="11"/><circle class="anim-stroke" data-len="' + len.toFixed(2) + '" data-c="' + C.toFixed(2) + '" cx="60" cy="60" r="' + Rr + '" fill="none" stroke="' + col + '" stroke-width="11" stroke-linecap="round" stroke-dasharray="0 ' + C.toFixed(2) + '" transform="rotate(-90 60 60)"/><text x="60" y="68" text-anchor="middle" style="font-size:24px;font-weight:600;fill:#f5f5f7">' + it.n + '/' + it.d + '</text></svg><div style="margin-top:.7rem;font-size:14px;font-weight:600;color:#f5f5f7;letter-spacing:-.016em">' + it.l + '</div><div style="font-size:12px;color:#86868b;margin-top:.2rem">' + it.s + '</div></div>';
    }).join('') + '</div>';
  };

  /* ---------- 계산기 1: 기간별 회원 배분율 ---------- */
  var TIER = [[7, 30], [30, 40], [60, 50], [90, 60], [180, 70], [Infinity, 80]];
  function rate(d) { for (var i = 0; i < TIER.length; i++) if (d <= TIER[i][0]) return TIER[i][1]; return 80; }
  function avg(N) { var s = 0; for (var d = 1; d <= N; d++) s += rate(d); return s / N; }
  R.period = function (el) {
    el.innerHTML = '<div class="yz-grid"><div id="pd-fig"></div><div>' +
      '<div class="yz-big"><span id="pd-m">30</span>%<small>회원 배분율</small></div>' +
      '<ul class="yz-list" style="margin-top:1rem"><li><span>회사 배분율</span><b id="pd-c">70%</b></li><li><span>해당 일까지 평균 회원 몫 [계산]</span><b id="pd-a">30%</b></li><li><span>가정 순이익 대비 회원 몫 [계산·가정]</span><b id="pd-p">0 SOL</b></li></ul>' +
      '<label>자금 활성 기간 <span id="pd-dv">1일</span></label><input type="range" id="pd-d" min="1" max="365" value="1" aria-label="자금 활성 기간(일)"><div class="yz-ticks"><span>1</span><span>30</span><span>90</span><span>180</span><span>365일</span></div>' +
      '<label>가정 순이익(SOL, 해당 기간 합계)</label><input type="number" id="pd-pf" min="0" step="1" value="10" inputmode="decimal"></div></div>' +
      '<p class="yz-note">백서 12쪽의 기간별 표를 그대로 적용했습니다. 평균은 매일의 배분율을 평균한 계산값이며, 순이익이 매일 같다고 가정한 단순 계산입니다. 실제 배분은 순결과와 최종 약관에 따르고, 순이익은 0이거나 음수일 수 있습니다.</p>';
    var fig = el.querySelector('#pd-fig'), d = el.querySelector('#pd-d'), pf = el.querySelector('#pd-pf');
    function upd() {
      var N = +d.value, m = rate(N), a = avg(N), p = Math.max(+pf.value || 0, 0);
      fig.innerHTML = donutSVG([{ v: m, l: '회원', c: '#2dd4bf' }, { v: 100 - m, l: '회사', c: '#48484c' }], m + '%', N + '일차 회원 몫');
      el.querySelector('#pd-m').textContent = m; el.querySelector('#pd-c').textContent = (100 - m) + '%';
      el.querySelector('#pd-a').textContent = f(a, 1) + '%'; el.querySelector('#pd-dv').textContent = N + '일';
      el.querySelector('#pd-p').textContent = f(p * a / 100, 2) + ' SOL';
      requestAnimationFrame(function () { arm(fig); });
    }
    d.addEventListener('input', upd); pf.addEventListener('input', upd); upd();
  };

  /* ---------- 계산기 2: 추천 인센티브 ---------- */
  R.refcalc = function (el) {
    el.innerHTML = '<div class="yz-grid"><div>' +
      '<div><label>추천 사용자 활성 AUM(SOL)</label><input type="number" id="rc-a1" min="0" step="1" value="100" inputmode="decimal"></div>' +
      '<label>해당 기간 순이익률 r <span id="rc-rv">1.0%</span></label><input type="range" id="rc-r" min="-2" max="2" step="0.1" value="1" aria-label="순이익률 r(%)">' +
      '<div class="yz-ticks"><span>-2%</span><span>0</span><span>백서 참고 0.5–1%</span><span>2%</span></div></div><div>' +
      '<ul class="yz-list"><li><span>전략 수익 P = A × r</span><b id="rc-p1">1 SOL</b></li><li><span>추천 인센티브 × 10%</span><b id="rc-i1">0.1 SOL</b></li></ul>' +
      '<div class="yz-big" style="margin-top:1rem"><span id="rc-t">0.1</span> SOL<small>추천 인센티브</small></div></div></div>' +
      '<p class="yz-note" id="rc-n">백서 13쪽의 P = A × r 및 추천 10% 규칙을 곱한 산수입니다. 설명용 파라미터이며 고정 수익 약속이 아닙니다.</p>';
    var q = function (s) { return el.querySelector(s); };
    function upd() {
      var a1 = Math.max(+q('#rc-a1').value || 0, 0), r = +q('#rc-r').value;
      var p1 = a1 * r / 100, i1 = Math.max(p1, 0) * .1, t = i1;
      q('#rc-rv').textContent = f(r, 1) + '%'; q('#rc-p1').textContent = f(p1, 2) + ' SOL';
      q('#rc-i1').textContent = f(i1, 3) + ' SOL'; q('#rc-t').textContent = f(t, 3);
      q('#rc-n').textContent = r <= 0 ? '순이익률이 0 이하이면 인센티브 기준이 되는 전략 수익이 없어 0으로 표시했습니다. 손실 시 처리는 백서에 정해져 있지 않습니다.' : '백서 13쪽의 P = A × r 및 추천 10% 규칙을 곱한 산수입니다. 설명용 파라미터이며 고정 수익 약속이 아닙니다.';
    }
    el.addEventListener('input', upd); upd();
  };

  /* ---------- 계산기 3: 회원 몫 시나리오 막대 ---------- */
  R.scen = function (el) {
    el.innerHTML = '<label style="margin-top:1.2rem">참여 금액 A(SOL) <span id="sc-av">100</span></label><input type="number" id="sc-a" min="1" max="100" step="1" value="100" inputmode="decimal"><div id="sc-fig" style="margin-top:1.4rem"></div>' + legend([{ l: '1–7일 구간(회원 30%)', c: '#5eead4' }, { l: '181일부터(회원 80%)', c: '#2dd4bf' }]) +
      '<p class="yz-note">하루 순이익률 r마다 회원 몫이 얼마인지 곱해 본 값입니다. 백서는 순이익이 없거나 손실일 때 누가 부담하는지 정하지 않아, 0 이하는 막대 대신 “미규정”으로 표시했습니다. r은 백서의 설명용 수치(0.5–1%)와 가정(0, -1%)이며 전망이 아닙니다.</p>';
    var rs = [-1, 0, .5, 1], fig = el.querySelector('#sc-fig'), inp = el.querySelector('#sc-a');
    function upd() {
      var A = Math.min(Math.max(+inp.value || 0, 0), 100), W = 520, H = 250, base = 200, hmax = 150, mx = A * .01 * .8 || 1, s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="하루 순이익률별 회원 몫(SOL)">';
      s += '<line class="grid-l" x1="20" x2="' + (W - 20) + '" y1="' + base + '" y2="' + base + '"/>';
      rs.forEach(function (r, i) {
        var gx = 40 + i * 120, profit = A * r / 100;
        if (profit <= 0) { s += '<text x="' + (gx + 50) + '" y="' + (base - 60) + '" text-anchor="middle" style="fill:#ff8a7a;font-weight:600;font-size:14px">미규정</text><text x="' + (gx + 50) + '" y="' + (base - 40) + '" text-anchor="middle" style="font-size:12px">손실·0일 때</text>'; }
        else [.3, .8].forEach(function (sh, k) {
          var h = hmax * (profit * sh) / mx, x = gx + k * 44;
          s += '<rect class="anim-bar" x="' + x + '" y="' + (base - h).toFixed(1) + '" width="38" height="' + h.toFixed(1) + '" rx="6" fill="' + (k ? '#2dd4bf' : '#5eead4') + '"/><text x="' + (x + 19) + '" y="' + (base - h - 8).toFixed(1) + '" text-anchor="middle" style="fill:#f5f5f7;font-weight:600">' + f(profit * sh, 2) + '</text>';
        });
        s += '<text x="' + (gx + 41) + '" y="' + (base + 22) + '" text-anchor="middle">r = ' + (r > 0 ? '+' : '') + r + '%</text>';
      });
      fig.innerHTML = s + '</svg>'; el.querySelector('#sc-av').textContent = f(A, 0);
      requestAnimationFrame(function () { el.classList.add('on'); });
    }
    inp.addEventListener('input', upd); upd();
  };


  /* ---------- 흐름도: 단계 카드 + 화살표 ---------- */
  R.flow = function (el) {
    var st = J(el.dataset.steps, []);
    el.innerHTML = '<ol class="yz-flow">' + st.map(function (x, i) {
      return '<li class="anim-fade" style="transition-delay:' + (i * .12) + 's"><span class="yz-fn">' + (i + 1) + '</span><b>' + x.t + '</b><small>' + x.d + '</small>' + (x.tag ? '<em>' + x.tag + '</em>' : '') + '</li>';
    }).join('') + '</ol>';
  };

  /* ---------- 가로 막대 비교 ---------- */
  R.bars = function (el) {
    var it = J(el.dataset.items, []), max = +el.dataset.max || Math.max.apply(null, it.map(function (x) { return x.v; })), unit = el.dataset.unit || '';
    el.innerHTML = '<div class="yz-bars">' + it.map(function (x, i) {
      return '<div class="yz-bar"><span>' + x.l + '</span><div class="yz-bt"><i class="anim-w" style="--w:' + (x.v / max * 100).toFixed(1) + '%;background:' + (x.c || PAL[i % PAL.length]) + ';transition-delay:' + (i * .12) + 's"></i></div><b>' + f(x.v, 1) + unit + (x.t ? '<small>' + x.t + '</small>' : '') + '</b></div>';
    }).join('') + '</div>';
  };

  /* ---------- 초기화 ---------- */
  document.querySelectorAll('[data-yz]').forEach(function (el, i) {
    var t = el.dataset.yz; if (!R[t]) return;
    el.classList.add('yz'); if (!el.id) el.id = 'yz' + i;
    R[t](el);
    if (el.dataset.title) el.insertAdjacentHTML('afterbegin', '<h3>' + el.dataset.title + '</h3>' + (el.dataset.cap ? '<p class="yz-cap">' + el.dataset.cap + '</p>' : ''));
    if (el.dataset.src) el.insertAdjacentHTML('beforeend', '<p class="yz-src">' + el.dataset.src + '</p>');
  });

  function show(el) { el.classList.add('on'); arm(el); }
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -12% 0px', threshold: .15 });
    document.querySelectorAll('.yz').forEach(function (el) { io.observe(el); });
  } else document.querySelectorAll('.yz').forEach(show);

  /* ---------- 영상 배경: 보일 때만 로드·재생 ---------- */
  var save = navigator.connection && (navigator.connection.saveData || /(^|-)2g$/.test(navigator.connection.effectiveType || ''));
  document.querySelectorAll('.vbg[data-src]').forEach(function (b) {
    if (b.dataset.poster) b.style.backgroundImage = 'url(' + b.dataset.poster + ')';
    if (reduce || save) return;
    var v = null;
    var vo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          if (!v) {
            v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'none'; v.setAttribute('aria-hidden', 'true'); v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
            v.src = b.dataset.src; v.addEventListener('canplay', function () { v.classList.add('ready'); }, { once: true }); b.appendChild(v);
          }
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else if (v) v.pause();
      });
    }, { rootMargin: '150px 0px' });
    vo.observe(b);
  });
})();
