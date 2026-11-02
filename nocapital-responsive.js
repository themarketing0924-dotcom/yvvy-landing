// 표의 머리글 글자를 각 칸의 라벨로 복사 (폰에서 카드형으로 보일 때 사용)
(function () {
  document.querySelectorAll('table').forEach(function (t) {
    var heads = [].map.call(t.querySelectorAll('thead th'), function (th) { return th.textContent.trim(); });
    if (!heads.length) return;
    t.querySelectorAll('tbody tr').forEach(function (tr) {
      [].forEach.call(tr.children, function (td, i) { if (heads[i] && !td.hasAttribute('data-label')) td.setAttribute('data-label', heads[i]); });
    });
  });
})();
