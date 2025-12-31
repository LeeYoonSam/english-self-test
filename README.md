# English Self Test

영어 단어 암기를 위한 셀프 테스트 웹 애플리케이션입니다.

**Live Demo**: https://leeyoonsam.github.io/english-self-test/

## 주요 기능

- 단어 목록 직접 입력 및 관리
- 영어 → 한글, 한글 → 영어 테스트 모드
- 테스트 결과 및 오답 확인
- 로컬 스토리지를 활용한 데이터 저장

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| **프레임워크** | React 18 |
| **언어** | TypeScript |
| **빌드 도구** | Vite |
| **라우팅** | React Router DOM |
| **스타일링** | Tailwind CSS |
| **배포** | GitHub Pages + GitHub Actions |

---

## 프로젝트 구조

```
english-self-test/
├── src/
│   ├── components/          # 재사용 가능한 UI 컴포넌트
│   │   ├── common/          # 공통 컴포넌트 (Button, Card)
│   │   ├── result/          # 결과 페이지 컴포넌트
│   │   ├── test/            # 테스트 페이지 컴포넌트
│   │   └── upload/          # 단어 입력 컴포넌트
│   ├── contexts/            # React Context (전역 상태 관리)
│   ├── hooks/               # 커스텀 훅
│   ├── pages/               # 페이지 컴포넌트
│   ├── services/            # 비즈니스 로직 (파싱, 스토리지)
│   ├── types/               # TypeScript 타입 정의
│   ├── utils/               # 유틸리티 함수
│   ├── App.tsx              # 라우트 정의
│   └── main.tsx             # 앱 진입점
├── public/                  # 정적 파일
│   └── 404.html             # SPA 라우팅 지원용
├── .github/workflows/       # GitHub Actions 워크플로우
│   └── deploy.yml           # 자동 배포 설정
├── index.html               # HTML 템플릿
├── vite.config.ts           # Vite 설정
├── tailwind.config.js       # Tailwind CSS 설정
└── tsconfig.json            # TypeScript 설정
```

---

## 로컬 개발 가이드

### 요구사항

- Node.js 18 이상
- npm

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/LeeYoonSam/english-self-test.git
cd english-self-test

# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev
```

### 사용 가능한 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 결과물 미리보기 |
| `npm run lint` | ESLint 코드 검사 |

---

## 배포

이 프로젝트는 **GitHub Actions**를 사용하여 GitHub Pages에 자동 배포됩니다.

### 배포 프로세스

```
main 브랜치에 push → GitHub Actions 실행 → 빌드 → GitHub Pages 배포
```

### GitHub Actions 워크플로우 설명

`.github/workflows/deploy.yml` 파일의 각 섹션을 설명합니다:

#### 1. 트리거 조건 (on)

```yaml
on:
  push:
    branches: ['main']    # main 브랜치에 push될 때
  workflow_dispatch:       # 수동 실행 가능
```

- `push`: main 브랜치에 코드가 푸시되면 자동으로 워크플로우 실행
- `workflow_dispatch`: GitHub Actions 탭에서 수동으로 실행 가능

#### 2. 권한 설정 (permissions)

```yaml
permissions:
  contents: read      # 저장소 코드 읽기
  pages: write        # GitHub Pages에 쓰기
  id-token: write     # OIDC 토큰 발급 (보안 배포용)
```

GitHub Pages 배포에 필요한 최소 권한을 명시적으로 설정합니다.

#### 3. 동시성 제어 (concurrency)

```yaml
concurrency:
  group: 'pages'
  cancel-in-progress: true
```

- 같은 그룹의 워크플로우가 동시에 실행되지 않도록 제어
- 새로운 배포가 시작되면 진행 중인 이전 배포를 취소

#### 4. 빌드 작업 (build job)

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4           # 코드 체크아웃
      - uses: actions/setup-node@v4         # Node.js 설정
        with:
          node-version: 20
          cache: 'npm'                       # npm 캐시로 빌드 속도 향상
      - run: npm ci                          # 의존성 설치 (clean install)
      - run: npm run build                   # 프로덕션 빌드
      - uses: actions/configure-pages@v4    # Pages 설정
      - uses: actions/upload-pages-artifact@v3  # 빌드 결과물 업로드
        with:
          path: './dist'                     # Vite 빌드 출력 디렉토리
```

| 단계 | 설명 |
|------|------|
| `checkout` | GitHub 저장소의 코드를 가져옴 |
| `setup-node` | Node.js 20 버전 설치, npm 캐시 활성화 |
| `npm ci` | package-lock.json 기준 정확한 버전 설치 |
| `npm run build` | TypeScript 컴파일 + Vite 프로덕션 빌드 |
| `configure-pages` | GitHub Pages 환경 설정 |
| `upload-pages-artifact` | dist 폴더를 배포용 아티팩트로 업로드 |

#### 5. 배포 작업 (deploy job)

```yaml
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build                    # build 작업 완료 후 실행
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- `needs: build`: 빌드 작업이 성공한 후에만 실행
- `environment`: GitHub의 Environments 기능과 연동하여 배포 URL 표시
- `deploy-pages`: 업로드된 아티팩트를 GitHub Pages에 배포

### SPA 라우팅 지원

GitHub Pages는 기본적으로 SPA(Single Page Application) 라우팅을 지원하지 않습니다.
직접 URL로 접근하면 404 에러가 발생하는 문제를 해결하기 위해 다음 설정이 적용되어 있습니다:

#### 1. public/404.html

```html
<script>
  // 404 에러 시 현재 경로를 쿼리 파라미터로 변환하여 index.html로 리다이렉트
  // 예: /upload → /?/upload
</script>
```

#### 2. index.html

```html
<script>
  // 쿼리 파라미터로 전달된 경로를 복원
  // 예: /?/upload → /upload (history.replaceState 사용)
</script>
```

이 방식으로 사용자가 `https://leeyoonsam.github.io/english-self-test/upload`에 직접 접근해도 정상적으로 페이지가 표시됩니다.

### 처음 배포 시 설정

1. GitHub 저장소의 **Settings** → **Pages** 이동
2. **Source**를 **GitHub Actions**로 선택
3. main 브랜치에 push하면 자동 배포 시작

### 배포 상태 확인

- **Actions 탭**: https://github.com/LeeYoonSam/english-self-test/actions
- **배포된 사이트**: https://leeyoonsam.github.io/english-self-test/

---

## 라이선스

MIT License
