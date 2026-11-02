/* 카드·순서 항목에 골드 아이콘 타일 자동 삽입 (제목 키워드 기준) */
(function () {
  var P = {
    gift: '<rect x="3.5" y="9" width="17" height="11" rx="2"/><path d="M12 9v11M3.5 13h17M12 9c-2.5 0-4-1-4-2.5S9 4 10.5 4 12 7 12 9zm0 0c2.5 0 4-1 4-2.5S15 4 13.5 4 12 7 12 9z"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17" cy="9" r="2.4"/><path d="M16.5 14c2.8 0 4.5 1.8 4.5 4.5"/>',
    award: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.9z"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 016.5 3H20v16H6.5A2.5 2.5 0 004 21.5z"/><path d="M4 5.5v16M8.5 8h7"/>',
    shield: '<path d="M12 3l7.5 3v5.5c0 4.6-3.1 8.3-7.5 9.5-4.4-1.2-7.5-4.9-7.5-9.5V6z"/><path d="M8.8 12.2l2.2 2.2 4.3-4.6"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M16.5 14.5h1.5"/>',
    alert: '<path d="M12 4l9 15.5H3z"/><path d="M12 10v4.5M12 17.2v.1"/>',
    building: '<path d="M4 20V8l8-4.5L20 8v12M4 20h16M9 20v-5h6v5"/>',
    chart: '<path d="M4 20V4M4 20h16"/><path d="M8 15l3.5-4 3 2.5L19 8"/>',
    coin: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/>',
    cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12L4 7.5M12 12v9"/>',
    swap: '<path d="M5 8h13l-3.5-3.5M19 16H6l3.5 3.5"/>',
    chat: '<path d="M4 5.5h16v10H10l-4.5 4v-4H4z"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5M12 14.5v2.5"/>',
    rocket: '<path d="M14 4c3 .3 5.5 2.8 6 6-2.8 3.4-6 5.3-9.5 6.2L7.8 13.5C8.7 10 10.6 6.8 14 4z"/><circle cx="14.8" cy="9.2" r="1.4"/><path d="M7.8 13.5l-3 .8 1.4-3.2M10.5 16.2l-.8 3 3.2-1.4"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    calendar: '<rect x="4" y="5.5" width="16" height="14" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.8 2.8 5.5-5.6"/>',
    truck: '<path d="M3 6.5h11v9.5H3zM14 9.5h3.8l2.7 3v3.5H14"/><circle cx="7.5" cy="17.5" r="1.9"/><circle cx="17" cy="17.5" r="1.9"/>',
    scale: '<path d="M12 4v16M7 20h10M5 7.5h14"/><path d="M5 7.5L2.8 13.5a3 3 0 005.4 0zM19 7.5l-2.2 6a3 3 0 005.4 0z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'
  };
  var MAP = [
    [/에어드롭 설계|무료 에어드롭/, 'gift'], [/추천·레퍼럴|추천 기록|레퍼럴/, 'users'], [/기여 보상/, 'award'],
    [/구조 이해|구조를 이해/, 'book'], [/검증/, 'shield'], [/가입 절차|가이드|지갑/, 'wallet'], [/위험|한계/, 'alert'],
    [/회사|Binance|거래·금융/, 'building'], [/프로젝트 성공|CoinMarketCap|데이터/, 'chart'],
    [/개인 참여|스테이블코인/, 'coin'], [/24시간|주기/, 'clock'],
    [/상거래|BNB Chain|블록체인|Miner/, 'cube'], [/커뮤니티 성장|커뮤니티 관리|공동|커뮤니티/, 'users'],
    [/현물|교환/, 'swap'], [/채팅/, 'chat'], [/에스크로/, 'lock'], [/미달성|요건 충족/, 'calendar'], [/수수료/, 'wallet'], [/이행|배송/, 'truck'], [/해결|정산/, 'scale'], [/후속/, 'rocket'], [/발견/, 'search'],
    [/분기별|결과/, 'calendar'], [/자격|지급/, 'check'], [/수령/, 'gift'], [/수령한|이미 지급/, 'wallet'], [/Trust Wallet/, 'wallet']
  ];
  function pick(t) { for (var i = 0; i < MAP.length; i++) if (MAP[i][0].test(t)) return MAP[i][1]; return null; }
  function mk(name) { var s = document.createElement('span'); s.className = 'ico'; s.setAttribute('aria-hidden', 'true'); s.innerHTML = '<svg viewBox="0 0 24 24">' + P[name] + '</svg>'; return s; }

  document.querySelectorAll('.card').forEach(function (c) {
    if (c.querySelector('.ico')) return;
    var h = c.querySelector('h3'); if (!h) return;
    var name = pick(h.textContent); if (!name) return;
    if (c.querySelector('.num')) c.classList.add('has-num');
    c.insertBefore(mk(name), c.firstChild);
  });
  document.querySelectorAll('.flowline div').forEach(function (d) {
    var b = d.querySelector('b'); if (!b || d.querySelector('.ico')) return;
    var name = pick(b.textContent.replace(/^[①②③④]\s*/, '')) || 'check';
    d.insertBefore(mk(name), d.firstChild);
  });
})();
