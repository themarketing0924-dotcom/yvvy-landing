/* 단계별 교육 퍼널: <body data-step="1..4"> 기준으로 진행 표시줄·이해 확인 게이트·단계 잠금 안내 */
(function () {
  var STEPS = [
    { n: 1, label: '1 구조 이해', href: 'nocapital.html' },
    { n: 2, label: '2 가입 절차', href: 'nocapital-join.html' },
    { n: 3, label: '3 회사 소개', href: 'company.html' },
    { n: 4, label: '4 비전', href: 'vision.html' }
  ];
  var KEY = 'yvvy_funnel_done';
  var cur = parseInt(document.body.getAttribute('data-step'), 10);
  if (!cur) return;

  function read() { try { return parseInt(localStorage.getItem(KEY), 10) || 0; } catch (e) { return 0; } }
  function write(n) { try { if (n > read()) localStorage.setItem(KEY, String(n)); } catch (e) {} }

  var done = read();

  // 진행 표시줄
  var bar = document.createElement('div');
  bar.className = 'fprog';
  STEPS.forEach(function (s) {
    var el = document.createElement(s.n === cur ? 'span' : 'a');
    if (s.n !== cur) el.href = s.href;
    el.textContent = s.label;
    if (s.n === cur) el.className = 'cur'; else if (s.n <= done) el.className = 'done';
    bar.appendChild(el);
  });
  document.body.appendChild(bar);
  document.body.classList.add('has-fprog');

  // 이해 확인 게이트
  var gate = document.querySelector('.gate');
  if (gate) {
    var boxes = gate.querySelectorAll('input[type=checkbox]');
    var next = gate.querySelector('.gate-next');
    var hint = gate.querySelector('.gate-hint');
    var update = function () {
      var ok = Array.prototype.every.call(boxes, function (b) { return b.checked; });
      next.setAttribute('aria-disabled', ok ? 'false' : 'true');
      if (hint) hint.style.display = ok ? 'none' : 'block';
    };
    boxes.forEach(function (b) { b.addEventListener('change', update); });
    next.addEventListener('click', function () { write(cur); });
    update();
  }

  // 가입 단계: 구조 이해를 건너뛰고 온 경우 안내
  if (cur === 2 && done < 1) {
    var hero = document.querySelector('.hero .wrap');
    if (hero) {
      var n = document.createElement('div');
      n.className = 'fnotice';
      var first = STEPS[0];
      n.innerHTML = '아직 앞 단계를 모두 확인하지 않으셨습니다. 참여 전에 <a href="' + first.href + '">' + first.label.slice(2) + '</a>부터 확인하시길 권합니다.';
      hero.appendChild(n);
    }
  }

  // 하단 고정 버튼과 상단 버튼은 현재 단계의 다음으로
  var sticky = document.querySelector('.sticky a');
  if (sticky && gate) { sticky.setAttribute('href', '#gate'); sticky.textContent = '다음 단계로 →'; }
})();
