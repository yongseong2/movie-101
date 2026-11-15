# MOVIE 101 — Frontend

> 32강 영화·배우 월드컵으로 취향을 찾고, 한줄평과 토론으로 영화를 나누는 서비스

Vue 2 · Vuex · Vue CLI 로 만들었던 프론트엔드를 **Vue 3 + Nuxt 3 + TypeScript** 로 마이그레이션하고,
Options API 로 작성된 컴포넌트를 **Composition API** 로 전환하며 반복되던 로직을 **composable** 로 재구성했습니다.

## 기술 스택

| 구분 | Before (v1) | After (v2) |
| --- | --- | --- |
| Framework | Vue 2.6 · Vue CLI (SPA) | Vue 3.5 · Nuxt 3 (SSR) |
| Language | JavaScript | TypeScript (strict) |
| Component | Options API | `<script setup>` Composition API |
| State | Vuex + vuex-persistedstate(localStorage) | Pinia + `useCookie` (SSR 에서도 세션 인식) |
| HTTP | 컴포넌트마다 axios 직접 호출 | `$fetch` 플러그인 + 도메인별 레포지토리 |
| Routing | 라우트 배열 + 라우트 이름 하드코딩 가드 | 파일 기반 라우팅 + `definePageMeta` + 전역 미들웨어 |
| Style | Bootstrap CDN + 페이지별 CSS 복붙 | 디자인 토큰(CSS 변수) + SCSS 도구 + UI 컴포넌트 |
| Quality | - | ESLint(flat) · vue-tsc · Vitest |

## 주요 개선 사항

### 1. 아키텍처
- **레포지토리 레이어** — `repositories/*` 에 도메인별 API 함수를 모으고, `plugins/api.ts` 에서 `baseURL`·토큰 헤더 주입·401 처리를 한 번에 담당합니다. 컴포넌트에서 반복되던 `axios({ headers: { Authorization } })` 코드와 하드코딩된 `API_URL` 이 사라졌습니다.
- **응답 정규화** — 파이썬 리스트 문자열(`"['봉준호']"`)로 내려오는 감독·출연진·예고편 키를 `toMovieDetail` 매퍼에서 배열로 변환해 화면 코드가 데이터 형식을 몰라도 되게 했습니다.
- **Nitro 서버 라우트** — 브라우저 번들에 노출되던 TMDB API 키를 `server/api/tmdb/*` 로 옮기고, 필요한 필드만 내려주며 `defineCachedEventHandler` 로 응답을 캐싱합니다.
- **SSR + 쿠키 세션** — 토큰을 쿠키에 저장해 서버 렌더링 단계에서도 로그인 상태와 권한을 판단합니다.

### 2. Composition API · composable
| composable | 역할 | 대체한 코드 |
| --- | --- | --- |
| `useTournament<T>` | 제네릭 싱글 엘리미네이션 로직 (부전승 · 되돌리기 · 진행률) | 영화/배우 월드컵 페이지에 복사돼 있던 `data`·`watch` 로직 |
| `usePagination` | 페이지 범위 계산 · 라우트 쿼리 동기화 | 게시판 컴포넌트 내부 계산 |
| `useAsyncAction` | pending · 중복 제출 방지 · 에러 토스트 | 각 메서드의 `.then/.catch` + `alert()` |
| `useAuth` | 로그인 · 회원가입 · 로그아웃 · 비밀번호 변경 흐름 | Vuex mutation 안에서 라우팅·alert 까지 하던 코드 |
| `useArticleActions` · `useCommentActions` · `useReviewActions` | 도메인 변경 액션 + 확인 다이얼로그 + 캐시 갱신 | 부모 함수를 props 로 내려 재조회하던 구조 |
| `useChallengeDefinition` | 영화/배우 월드컵의 차이점(API·문구)만 선언 | 거의 동일한 페이지 2개 + 컴포넌트 6개 |
| `useToast` · `useConfirm` | 전역 토스트 · Promise 기반 확인 다이얼로그 | `alert()` · 확인 없는 즉시 삭제 |

### 3. 버그 수정 · UX
- 댓글·리뷰마다 `is_mine` 을 확인하려고 보내던 **N+1 API 요청 제거** (작성자 비교로 대체)
- 배우 월드컵 라우트 이름 오타로 **인증 가드가 동작하지 않던 문제** 수정
- 상세 페이지 진입 시 같은 영화 API 를 두 번 호출하던 문제(예고편 컴포넌트) 수정
- 작성자가 아니면 게시글 수정 화면 자체에 진입할 수 없도록 403 처리
- 별점 입력을 숫자 입력 + `isNaN` 검증에서 접근성 있는 별점 컴포넌트(키보드 지원)로 변경
- Bootstrap carousel DOM 을 `cloneNode` 로 조작하던 슬라이더를 CSS scroll-snap 레일로 교체
- 월드컵 키보드 단축키(←/→, Backspace 되돌리기), 결과 화면에서 추천 영화 자동 조회
- 이미지 지연 로딩 · TMDB 이미지 사이즈 최적화(`original` → 용도별 `w185~w780`) · 스켈레톤 UI

### 4. 디자인
- 로고의 팝콘 컬러(레드·옐로)를 포인트로 한 **다크 시네마 테마** 와 디자인 토큰(`assets/styles/_tokens.scss`)
- Pretendard 폰트, 반응형 레이아웃(모바일 메뉴 · 그리드), 페이지 전환 · 토스트 · 모달 애니메이션
- 공통 UI: `UiButton` `UiField` `UiModal` `UiStarRating` `UiPagination` `UiPoster` `UiAvatar` `UiSkeleton` `UiEmptyState` `UiIcon`

## 폴더 구조

```
final-front-pjt/
├─ assets/styles/      # 디자인 토큰 · SCSS 도구 · 전역 스타일
├─ components/
│  ├─ ui/              # 범용 UI 컴포넌트 (Ui*)
│  ├─ app/             # 헤더 · 푸터 · 토스트 · 확인 다이얼로그
│  ├─ movie/ community/ challenge/ auth/   # 도메인 컴포넌트
├─ composables/        # 재사용 로직 (use*)
├─ middleware/         # auth.global.ts — requiresAuth / guestOnly
├─ pages/              # 파일 기반 라우팅
├─ plugins/api.ts      # $fetch 인스턴스 + 레포지토리 주입
├─ repositories/       # 도메인별 API 함수
├─ server/api/tmdb/    # TMDB 프록시 (Nitro)
├─ stores/auth.ts      # Pinia 인증 스토어
├─ types/              # API · 도메인 타입
├─ utils/              # 순수 함수 (포맷 · 이미지 URL · 에러 메시지 등)
└─ tests/              # Vitest 단위 테스트
```

## 라우트

| 경로 | 설명 | 접근 |
| --- | --- | --- |
| `/` | 홈 (히어로 · 현재 상영작 · 인기 TOP 10) | 전체 |
| `/movies`, `/movies/:id` | 영화 목록(탭) · 상세(예고편 · 한줄평) | 전체 |
| `/search?q=` | 영화 검색 | 전체 |
| `/challenge/movie`, `/challenge/actor` | 영화 · 배우 월드컵 | 로그인 |
| `/community`, `/community/:id` | 게시판 · 상세(댓글) | 전체 |
| `/community/new`, `/community/:id/edit` | 글 작성 · 수정 | 로그인 |
| `/profile/:username` | 프로필 (게시글 · 댓글 · 한줄평) | 로그인 |
| `/login`, `/signup` | 로그인 · 회원가입 | 비로그인 |
| `/account/password` | 비밀번호 변경 | 로그인 |

이전 URL(`/moviechallenge`, `/actorchallenge`, `/movie/:id`, `/create`)은 `routeRules` 로 새 경로에 리다이렉트됩니다.

## 실행 방법

```bash
# 1) 환경 변수 설정
cp .env.example .env   # NUXT_TMDB_API_KEY 에 TMDB API 키 입력

# 2) 의존성 설치 및 개발 서버 실행 (백엔드: final-back-pjt 를 127.0.0.1:8000 에서 실행)
npm install
npm run dev
```

| 스크립트 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` / `npm run preview` | 프로덕션 빌드 / 미리보기 |
| `npm run typecheck` | vue-tsc 타입 검사 |
| `npm run lint` | ESLint |
| `npm test` | Vitest 단위 테스트 |
