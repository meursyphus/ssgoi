# Giscus 댓글 시스템 설정 가이드

## 1. GitHub Repository 설정

### 1.1 Discussions 활성화
1. GitHub 저장소로 이동 (https://github.com/meurSyphus/ssgoi)
2. Settings > Features 섹션으로 이동
3. "Discussions" 체크박스 활성화

### 1.2 Discussion 카테고리 생성
1. Discussions 탭으로 이동
2. 카테고리 편집 (연필 아이콘)
3. "Blog Comments" 카테고리 생성 (Announcement 타입 권장)

## 2. Giscus 설정값 가져오기

### 2.1 Giscus 설정 페이지 방문
https://giscus.app 방문

### 2.2 Repository 설정
- Repository: `meurSyphus/ssgoi` 입력
- Discussion Category: "Blog Comments" 선택
- Mapping: "specific" 선택 (slug 기반으로 매핑)

### 2.3 필요한 ID 값 복사
설정 완료 후 생성되는 스크립트에서:
- `data-repo-id` 값 복사
- `data-category-id` 값 복사

## 3. 컴포넌트 설정 업데이트

`/apps/docs/src/components/blog/giscus-comments.tsx` 파일에서:

```typescript
<Giscus
  repo="meurSyphus/ssgoi"
  repoId="실제_REPO_ID_입력" // 위에서 복사한 값
  category="Blog Comments"
  categoryId="실제_CATEGORY_ID_입력" // 위에서 복사한 값
  // ... 나머지 설정
/>
```

## 4. 다국어 댓글 통합 원리

- **핵심**: `term={`blog-post-${slug}`}` 설정
- 같은 slug의 포스트는 언어 경로가 달라도 (`/ko/blog/post1`, `/en/blog/post1`) 동일한 Discussion 스레드를 공유
- 댓글 UI 언어는 `lang` prop으로 자동 전환

## 5. 테스트 방법

1. 개발 서버 실행: `pnpm docs:dev`
2. 한국어 포스트 접속: `/ko/blog/[slug]`
3. 댓글 작성
4. 영어 포스트 접속: `/en/blog/[slug]`
5. 같은 댓글이 표시되는지 확인

## 주의사항

- Repository는 반드시 Public이어야 함
- Discussions 기능이 활성화되어 있어야 함
- 첫 댓글 작성 시 GitHub 로그인 필요