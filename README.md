# YVVY 백서 데이터 분석 랜딩

YVVY 생태계 소개 백서(19쪽)를 근거로, 숫자·차트·표로 구조를 분석해 보여 주는 8페이지 정적 사이트입니다.
모든 수치는 `[백서]` 원문 값, `[계산]` 원문 규칙으로 다시 계산한 값, `[가정]` 입력값으로 구분합니다.

- `nocapital.html` 개요 · 시장 문제 · 수익 구조 · 검증 현황
- `nocapital-join.html` 참여 구조 · 기간별 배분율 · 입금 전 확인
- `company.html` 프로젝트 분석(포지셔닝·경쟁력·AI 지원·팀 검증)
- `vision.html` 로드맵 · 활용 사례 · 해외 운용사 표현 · 규제 대조
- `community.html` 인센티브 구조(추천·V1–V6·누적 풀)
- `nocapital-token.html` 수익 배분 데이터 분석(곡선·시나리오)
- `nocapital-benefits.html` 기대와 위험(Meteora DLMM 포함)
- `my-link.html` 참여 시뮬레이터
- 배포: Cloudflare Workers assets (`wrangler.jsonc`)

## 시각 요소 (2026-11-03)
- `yvvy-viz.css` / `yvvy-viz.js` — 도넛·레이더·꺾은선·진행 링 차트와 계산기 3종(기간별 배분율, 추천 인센티브, 회원 몫 시나리오). 모든 수치는 백서 값 또는 그 규칙으로 계산한 값이며 각 카드에 출처를 표기했습니다. 외부 라이브러리 없음. (번들 `site.css`와 별개 파일)
- `.vbg` 영상 배경 — 중요 섹션에서 기존 `hero-bg.mp4`·`join-bg.mp4`를 재사용. 화면에 보일 때만 로드·재생하고, 모션 줄이기/데이터 절약 모드에서는 포스터만 표시.
- `assets/yvvy-ring.webp`, `assets/yvvy-shield.webp` — 백서 1·2쪽의 3D 이미지(알파 합성, CSS로 민트 톤 이동).
