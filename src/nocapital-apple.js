/* 섹션을 검정(dk)/라이트(lt)로 교차 지정 — Apple 제품 페이지식 리듬 */
(function () {
  var plans = { benefits: ['dk', 'dk', 'lt', 'dk'] };
  var key = /benefits/.test(location.pathname) ? 'benefits' : '';
  var plan = plans[key];
  document.querySelectorAll('section').forEach(function (s, i) {
    s.classList.remove('alt');
    if (s.getAttribute('style') && /radial-gradient/.test(s.getAttribute('style'))) s.removeAttribute('style');
    s.classList.add(plan ? (plan[i] || 'dk') : (i % 2 === 0 ? 'dk' : 'lt'));
  });
})();
