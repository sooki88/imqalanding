# IMQA 랜딩페이지

**기술 스택** : `Next.js` `Typescript` `Tailwind CSS` `Supabase`

## 페이지

- `/` : 홈
- `/contact` : 문의하기
- `/privacy` : 개인정보처리방침
- `/term` : 이용약관
- `/admin` : 관리자 페이지(문의 조회, 뉴스 조회/수정, 로고 조회/업로드/삭제)

## 캐시 최적화

홈 진입 시 즉시 호출되는 **뉴스/로고 데이터**는 Supabase 무료 플랜 사용량(요청/대역폭) 부담을 줄이기 위해  
클라이언트에서 Supabase를 직접 호출하지 않고, **`app/api/*` Route Handler를 경유(fetch)하여 서버 캐시를 적용**합니다.

- 기본 TTL 캐시: **24시간** (`revalidate`)
- 관리자 수정 시: **캐시 태그 무효화(`revalidateTag` / `updateTag`)로 즉시 갱신**

> 문의/로그인/로그아웃은 홈 진입 시 자동으로 대량 호출되지 않거나 동적 성격이 강해, 현재는 캐시 최적화 대상에서 제외했습니다.

---

## 주요 폴더 구조

### `app/actions/`

Server Action 모음(필요 시 사용). 관리자 작업 후 캐시 태그 갱신 등 “즉시 반영”을 위한 로직에 사용합니다.

- `app/actions/news.ts` : 뉴스 관련 서버 액션(캐시 태그 갱신 포함)
- `app/actions/client-logos.ts` : 로고 관련 서버 액션(업로드/삭제/캐시 갱신)

### `app/api/`

Next.js Route Handler(API). Supabase 조회 + `revalidate`/tags 기반 캐시를 적용합니다.

- `app/api/news/route.ts` : 뉴스 목록 조회 API(캐시 적용)
- `app/api/client-logos/route.ts` : 로고 목록 조회 API(캐시 적용)

#### `app/api/admin/`

관리자 전용 API(쓰기 작업). DB 수정 후 캐시 태그를 무효화하여 홈에 즉시 반영되도록 합니다.

- `app/api/admin/news/route.ts` : 뉴스 수정 API(성공 시 캐시 갱신)
- `app/api/admin/client-logos/route.ts` : 로고 업로드/삭제 API(성공 시 캐시 갱신)

### `hooks/`

React Query 기반 훅과 인증/세션 훅 모음

- `useSupabase.tsx` : 브라우저 Supabase 클라이언트 훅(anon 키)
- `use-news-query.ts` : `/api/news` 조회 훅
- `use-client-logos-query.ts` : `/api/client-logos` 조회 훅
- `use-update-news-mutation.ts` : 뉴스 수정 mutation
- `use-upload-client-logo-mutation.ts` : 로고 업로드 mutation
- `use-delete-client-logo-mutation.ts` : 로고 삭제 mutation
- `use-admin-session-query.ts` : 관리자 세션 조회
- `use-sign-in-admin-mutation.ts`, `use-sign-out-mutation.ts` : 로그인/로그아웃 mutation
- `use-inquiries-query.ts` : 문의 조회 훅

### `queries/`

요청 단위 함수(쿼리/뮤테이션) 모음(Supabase 호출 래핑 또는 `/api/*` fetch 래핑)

- `create-inquiry.ts` : 문의 생성
- `get-inquiries.ts` : 문의 목록 조회
- `get-admin-session.ts` : 관리자 세션 조회
- `sign-in-admin.ts` : 관리자 로그인
- `sign-out.ts` : 로그아웃

### `supabase/`

Supabase CLI 설정

- `supabase/config.toml`

### `utils/`

공용 유틸/클라이언트

- `database.types.ts` : Supabase 타입
- `supabase.ts` : 브라우저 Supabase 클라이언트(anon)
- `supabase-server.ts` : 서버 전용 Supabase 클라이언트(서비스 키 사용)

---

## Data Flow (News & Client Logos)

1. 홈: React Query 훅 → `/api/news`, `/api/client-logos` 호출
2. API(Route Handler): Supabase 조회 → 캐시(TTL + tags) 적용 → 응답 반환
3. 관리자 수정: `/api/admin/*`로 쓰기 요청 → DB 반영 → 캐시 태그 무효화
4. 홈: refetch 시 최신 데이터 수신

---

## Environment Variables

`.env.local`

- `NEXT_PUBLIC_CHANNELTALK_PLUGIN_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` _(서버 전용, 절대 클라이언트 노출 금지)_
