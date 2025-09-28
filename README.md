# 🗨️ Quad Chat - 실시간 4인 채팅 애플리케이션

> 최대 4명까지 참여 가능한 크로스 플랫폼 실시간 채팅 서비스

[![Live Demo](https://img.shields.io/badge/Live%20Demo-quad--chat.vercel.app-blue?style=for-the-badge)](https://quad-chat.vercel.app)
[![Version](https://img.shields.io/badge/Version-v1.0.1-green?style=for-the-badge)](https://github.com/bulhwi/quad-chat/releases/tag/v1.0.1)
[![Korean Release Notes](https://img.shields.io/badge/한국어%20릴리즈%20노트-자동화-red?style=for-the-badge)](https://github.com/bulhwi/quad-chat/releases)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbulhwi%2Fquad-chat)

## ✨ 주요 기능

### 🔗 핵심 기능
- **4명 제한**: 방당 최대 4명까지만 입장 가능
- **실시간 채팅**: HTTP Polling 기반 실시간 메시지 송수신
- **크로스 플랫폼**: PC, 모바일, 태블릿 모든 기기에서 접속 가능
- **브라우저 호환**: Chrome, Safari, Firefox, Edge 등 모든 브라우저 지원
- **영구 저장**: Upstash Redis로 안정적인 데이터 보관

### 🎨 사용자 경험
- **직관적 UI**: 깔끔하고 사용하기 쉬운 인터페이스
- **반응형 디자인**: 모바일 최적화된 반응형 레이아웃
- **실시간 상태**: 연결 상태 및 참여자 수 실시간 표시
- **메시지 히스토리**: 늦게 참여해도 최근 100개 메시지 확인 가능
- **자동 정리**: 24시간 후 비활성 방 자동 삭제

### 📱 모바일 지원
- **터치 최적화**: 모바일 터치 인터페이스 완전 지원
- **햄버거 메뉴**: 모바일에서 사이드바 토글 기능
- **반응형 텍스트**: 화면 크기에 따른 텍스트 크기 자동 조정
- **안정적 연결**: HTTP Polling으로 모든 환경에서 안정적 작동

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Communication**: HTTP REST API + Polling

### Backend
- **Runtime**: Node.js (Serverless)
- **Database**: Upstash Redis (무료)
- **API**: REST API Routes
- **Deployment**: Vercel (Serverless)

### Infrastructure
- **Hosting**: Vercel
- **Database**: Upstash Redis (Tokyo)
- **CDN**: Vercel Edge Network
- **Domain**: vercel.app

## 로컬 실행 방법

```bash
# 1. 저장소 클론
git clone https://github.com/bulhwi/quad-chat.git
cd quad-chat

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 접속
http://localhost:3001
```

## 🗃️ Upstash Redis 설정

이 애플리케이션은 **Upstash Redis**를 사용하여 실시간 채팅 데이터를 저장합니다. 배포하기 전에 Redis 데이터베이스를 설정해야 합니다.

### 💎 **Upstash Redis 무료 플랜**

| 항목 | 무료 플랜 제공량 | 비고 |
|------|------------------|------|
| **일일 요청 수** | 10,000 requests | 채팅 앱에 충분 |
| **데이터 크기** | 256MB | 수천 개 방 저장 가능 |
| **동시 연결** | 제한 없음 | 무제한 사용자 |
| **데이터 보관** | 영구 보관 | 삭제되지 않음 |
| **지역** | 전 세계 | Tokyo 리전 사용 권장 |

### 🚀 **5분 설정 가이드**

#### **1단계: Upstash 계정 생성** ⏱️ 2분

1. **https://console.upstash.com** 접속
2. **"Sign up with GitHub"** 클릭
3. GitHub 계정으로 무료 회원가입 완료

#### **2단계: Redis 데이터베이스 생성** ⏱️ 1분

1. **"Create Database"** 버튼 클릭
2. 설정값 입력:
   ```
   Name: quad-chat-db
   Region: Tokyo, Japan (또는 가장 가까운 지역)
   Type: Regional (기본값)
   ```
3. **"Create"** 버튼 클릭

#### **3단계: 연결 정보 복사** ⏱️ 1분

1. 생성된 데이터베이스 **클릭**
2. **"REST API"** 탭 선택
3. 다음 2개 값 복사:
   ```bash
   UPSTASH_REDIS_REST_URL="https://xxx-xxx-xxx.upstash.io"
   UPSTASH_REDIS_REST_TOKEN="AXXXxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```

#### **4단계: Vercel 환경변수 설정** ⏱️ 1분

1. **https://vercel.com/dashboard** 접속
2. **quad-chat** 프로젝트 클릭
3. **Settings** → **Environment Variables** 이동
4. 다음 2개 변수 추가:
   ```
   Name: UPSTASH_REDIS_REST_URL
   Value: [3단계에서 복사한 URL]

   Name: UPSTASH_REDIS_REST_TOKEN
   Value: [3단계에서 복사한 토큰]
   ```
5. **"Save"** 클릭

### 🔧 **로컬 개발 설정**

로컬에서 개발하려면 `.env.local` 파일을 생성하세요:

```bash
# .env.local 파일 생성
UPSTASH_REDIS_REST_URL=your_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

### 📊 **Redis 사용량 모니터링**

- **Upstash 콘솔**에서 실시간 사용량 확인 가능
- **Metrics** 탭에서 요청 수, 저장 용량 등 확인
- 무료 한도 초과 시 자동 알림

### 🔍 **데이터 구조**

```json
{
  "room:abc123": {
    "users": [
      {
        "id": "user_123",
        "nickname": "사용자1",
        "joinedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "messages": [
      {
        "id": "msg_123",
        "userId": "user_123",
        "nickname": "사용자1",
        "message": "안녕하세요!",
        "timestamp": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### ⚠️ **주의사항**

- **무료 플랜** 일일 10,000 요청 제한 (충분함)
- **TTL 24시간** 설정으로 자동 방 정리
- **Tokyo 리전** 사용 시 한국에서 빠른 속도
- **HTTPS만 지원** (HTTP는 불가)

## 🚀 배포 방법

### 📋 현재 배포 상태
- **라이브 서비스**: [quad-chat.vercel.app](https://quad-chat.vercel.app)
- **자동 배포**: GitHub 푸시 시 자동 배포
- **빌드 상태**: ✅ 정상 빌드 완료

### 🎯 Vercel 원클릭 배포

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbulhwi%2Fquad-chat)

### 📝 수동 배포 방법

#### 1️⃣ Vercel 웹사이트에서 배포

```bash
# 1. 저장소 포크 또는 클론
git clone https://github.com/bulhwi/quad-chat.git
cd quad-chat

# 2. Vercel 웹사이트 접속
# https://vercel.com 방문

# 3. GitHub 계정으로 로그인

# 4. "Add New..." → "Project" 클릭

# 5. GitHub 저장소 선택
# - bulhwi/quad-chat 또는 본인의 포크된 저장소 선택

# 6. 프로젝트 설정 (기본값 유지)
# - Framework Preset: Next.js
# - Root Directory: ./
# - Build Command: npm run build
# - Output Directory: .next
# - Install Command: npm install

# 7. "Deploy" 클릭
```

#### 2️⃣ Vercel CLI로 배포

```bash
# 1. Vercel CLI 설치
npm install -g vercel

# 2. Vercel 로그인
vercel login

# 3. 프로젝트 디렉토리에서 배포
vercel

# 4. 프로덕션 배포
vercel --prod
```

#### 3️⃣ Vercel Git 자동 배포 (권장)

가장 간단하고 안정적인 방법입니다:

1. **Vercel에서 프로젝트 연결**:
   - Vercel 대시보드에서 "Add New..." → "Project"
   - GitHub 저장소 `bulhwi/quad-chat` 선택
   - "Import" 클릭

2. **자동 배포 설정**:
   - main 브랜치에 푸시 시 자동 배포
   - Pull Request 시 프리뷰 배포
   - 토큰 설정 불필요

### ⚙️ 배포 환경 설정

#### 필수 설정 사항
- **Node.js 버전**: 20.x (자동 감지)
- **빌드 명령어**: `npm run build`
- **시작 명령어**: `npm start`

#### 환경변수 (필수)
| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `UPSTASH_REDIS_REST_URL` | Redis 연결 URL | **필수 설정** |
| `UPSTASH_REDIS_REST_TOKEN` | Redis 인증 토큰 | **필수 설정** |
| `NODE_ENV` | 환경 모드 | `production` |

#### Vercel 최적화 설정
```json
// vercel.json (필요시)
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["icn1"] // 서울 리전
}
```

### 🔧 배포 아키텍처

#### 로컬 개발 환경
```
브라우저 ←→ Next.js Dev Server (3001) ←→ REST API Routes ←→ Upstash Redis
```

#### 프로덕션 환경 (Vercel)
```
브라우저 ←→ Vercel Edge ←→ Next.js App ←→ API Routes (/api/rooms/[roomId])
                                                    ↓
                                              Upstash Redis (Tokyo)
```

### 🚨 배포 주의사항

1. **Redis 설정**: Upstash Redis 환경변수 필수 설정 (URL, TOKEN)
2. **CORS 설정**: 모든 오리진 허용으로 설정됨 (`Access-Control-Allow-Origin: *`)
3. **데이터 저장소**: Upstash Redis 기반 영구 저장 (24시간 TTL)
4. **스케일링**: 서버리스 특성상 Redis로 상태 공유
5. **요청 제한**: 무료 플랜 일일 10,000 요청 한도

### 📊 배포 후 확인사항

#### ✅ 기능 테스트 체크리스트
- [ ] 메인 페이지 로딩
- [ ] 닉네임 입력 및 방 생성
- [ ] 방 코드로 참여
- [ ] 실시간 메시지 송수신
- [ ] 4명 제한 확인
- [ ] 모바일에서 접속 테스트
- [ ] 다양한 브라우저에서 테스트

#### 🔍 디버깅 도구
- **Vercel 로그**: Vercel 대시보드에서 함수 로그 확인
- **브라우저 콘솔**: HTTP 요청/응답 상태 확인
- **Network 탭**: REST API 호출 모니터링
- **Upstash 콘솔**: Redis 데이터 및 사용량 확인

## 📖 사용 방법

### 🎮 기본 사용법

#### 1️⃣ 방 생성하기
1. [quad-chat.vercel.app](https://quad-chat.vercel.app) 접속
2. 원하는 닉네임 입력 (최대 20자)
3. "새 방 만들기" 버튼 클릭
4. 생성된 7자리 방 코드를 친구들에게 공유

#### 2️⃣ 방 참여하기
1. 사이트 접속 후 닉네임 입력
2. "기존 방 참여하기" 클릭
3. 받은 방 코드 입력
4. "방 참여하기" 클릭

#### 3️⃣ 채팅하기
- 하단 입력창에 메시지 입력
- Enter 키 또는 "전송" 버튼으로 메시지 전송
- 우측 사이드바에서 참여자 목록 확인
- 모바일에서는 햄버거 메뉴로 사이드바 토글

### 📱 모바일 사용법
- **사이드바 열기**: 좌상단 햄버거 메뉴 탭
- **방 코드 복사**: 방 정보에서 "복사" 버튼 탭
- **메시지 스크롤**: 터치로 메시지 히스토리 스크롤

## 🏗️ 프로젝트 구조

```
quad-chat/
├── 📁 app/                         # Next.js App Router
│   ├── 📄 layout.tsx              # 글로벌 레이아웃
│   ├── 📄 page.tsx                # 메인 페이지 (방 생성/참여)
│   ├── 📄 globals.css             # 글로벌 스타일
│   ├── 📁 chat/[roomId]/          # 동적 채팅방 라우트
│   │   └── 📄 page.tsx           # 채팅방 페이지
├── 📁 pages/                      # Pages Router (API 전용)
│   └── 📁 api/
│       └── 📁 rooms/
│           └── 📄 [roomId].js    # REST API 라우트 (Redis 연동)
├── 📁 lib/                        # 유틸리티 라이브러리
│   ├── 📄 redis.ts               # Redis 연결 및 데이터 관리
│   ├── 📄 api.ts                 # HTTP 클라이언트
│   └── 📄 socket.ts              # Socket.io (로컬 개발용)
├── 📁 .github/workflows/          # GitHub Actions
│   └── 📄 korean-release.yml     # 🇰🇷 한국어 릴리즈 노트 자동화
├── 📁 scripts/                    # 자동화 스크립트
│   └── 📄 generate-korean-release.js # 한국어 릴리즈 노트 생성기
├── 📁 docs/                       # 프로젝트 문서
│   └── 📄 VERSIONING.md          # 버전 관리 가이드라인
├── 📄 CHANGELOG.md               # 🇰🇷 한국어 변경사항 기록
├── 📄 server.js                   # 로컬 개발용 커스텀 서버
├── 📄 package.json               # 프로젝트 설정 (v1.0.1)
├── 📄 tailwind.config.ts         # Tailwind CSS 설정
├── 📄 tsconfig.json              # TypeScript 설정
└── 📄 next.config.js             # Next.js 설정
```

### 🔧 주요 파일 설명

| 파일 | 역할 |
|------|------|
| `app/page.tsx` | 메인 페이지: 닉네임 입력, 방 생성/참여 |
| `app/chat/[roomId]/page.tsx` | 채팅방: HTTP Polling 기반 실시간 채팅 |
| `pages/api/rooms/[roomId].js` | REST API: 방 관리, 메시지 송수신 |
| `lib/redis.ts` | Redis 연결: 데이터 저장/조회 관리 |
| `lib/api.ts` | HTTP 클라이언트: API 호출 관리 |
| `CHANGELOG.md` | 🇰🇷 한국어 변경사항 기록 및 릴리즈 히스토리 |
| `.github/workflows/korean-release.yml` | 🤖 한국어 릴리즈 노트 자동화 워크플로우 |
| `scripts/generate-korean-release.js` | 한국어 릴리즈 노트 생성 스크립트 |
| `docs/VERSIONING.md` | Semantic Versioning 가이드라인 |
| `server.js` | 로컬 개발 서버: Socket.io + Next.js (로컬용) |

## 🛠️ 개발 스크립트

```bash
# 🚀 개발 관련
npm run dev          # 로컬 개발 서버 (커스텀 서버 + Socket.io)
npm run dev:next     # Next.js 개발 서버만 실행

# 🏗️ 빌드 관련
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버 실행

# 🧹 코드 품질
npm run lint         # ESLint 실행
npm run type-check   # TypeScript 타입 검사

# 📦 의존성 관리
npm install          # 의존성 설치
npm update           # 의존성 업데이트
```

## 🚀 개발 워크플로우

### 🔄 개발 및 릴리즈 프로세스

#### 📋 브랜치 전략
```bash
# main - 프로덕션 안정 버전
# develop - 개발 통합 브랜치
# feature/* - 기능별 개발 브랜치
```

#### 🛠️ 일반적인 개발 과정

```bash
# 1. 저장소 클론
git clone https://github.com/bulhwi/quad-chat.git
cd quad-chat

# 2. 의존성 설치
npm install

# 3. 기능 브랜치 생성
git checkout develop
git checkout -b feature/new-feature

# 4. 개발 서버 실행
npm run dev

# 5. 코드 수정 및 테스트
# http://localhost:3001에서 실시간 확인

# 6. 빌드 테스트
npm run build

# 7. 변경사항 커밋
git add .
git commit -m "feat: 새로운 기능 추가"

# 8. develop 브랜치로 PR 생성
git push origin feature/new-feature
# GitHub에서 feature/* → develop PR 생성

# 9. develop에서 테스트 후 main으로 릴리즈 PR
# develop → main PR 생성 및 머지

# 10. 릴리즈 태그 생성 (자동 릴리즈 노트 생성)
git checkout main
git pull origin main
git tag v1.x.x -m "릴리즈 메시지"
git push origin v1.x.x
```

### 🏷️ 버전 관리 시스템

#### Semantic Versioning (SemVer)
- **MAJOR** (1.0.0 → 2.0.0): 호환성 중단 변경사항
- **MINOR** (1.0.0 → 1.1.0): 새로운 기능 추가 (하위 호환)
- **PATCH** (1.0.0 → 1.0.1): 버그 수정 및 성능 개선

#### 🇰🇷 한국어 릴리즈 노트 자동화
```bash
# 태그 푸시 시 자동 실행되는 GitHub Actions
git tag v1.1.0 -m "이모티콘 기능 추가"
git push origin v1.1.0

# ↓ 자동으로 실행됨
# 1. CHANGELOG.md에서 변경사항 추출
# 2. 한국어 친화적 릴리즈 노트 생성
# 3. GitHub Release 자동 생성
# 4. 한국어 우선 정책 적용
```

#### 📝 CHANGELOG.md 관리
```bash
# 기능 개발 완료 시 CHANGELOG.md 업데이트
## [미배포] - Unreleased
### 추가됨
- 새로운 기능 설명

# 릴리즈 시 버전과 날짜 업데이트
## [1.1.0] - 2025-09-28 - ✨ 새로운 기능
```

### 🔧 개발 환경 설정

#### 권장 개발 도구
- **에디터**: VS Code
- **확장**: ES7+ React/Redux/React-Native snippets, Tailwind CSS IntelliSense
- **브라우저**: Chrome (개발자 도구)
- **터미널**: 통합 터미널 또는 별도 터미널

#### 필수 Node.js 버전
- **Node.js**: 20.x 이상
- **npm**: 10.x 이상

## 🇰🇷 한국어 우선 릴리즈 시스템

### ✨ 특징
- **한국어 우선 정책**: 모든 릴리즈 노트는 한국어로 먼저 작성
- **사용자 친화적**: 기술 용어보다 일반 사용자가 이해하기 쉬운 표현
- **자동화**: GitHub Actions를 통한 완전 자동화
- **Semantic Versioning**: 버전별 이모지와 친화적 제목 자동 생성

### 📋 한국어 기술 용어 표준화
| 영어 용어 | 한국어 용어 |
|----------|-----------|
| Breaking Changes | 호환성 중단 변경사항 |
| Migration | 업그레이드 방법 |
| Deprecated | 사용 중단 예정 |
| Performance | 성능 최적화 |
| Security | 보안 강화 |
| Bug Fix | 오류 수정 |

### 🎯 릴리즈 노트 예시
```markdown
# 🐛 Quad Chat v1.0.1 - 버그 수정 및 개선

안녕하세요! Quad Chat의 새로운 업데이트가 출시되었습니다! 🎉

## 🔧 수정사항
- GitHub Actions 권한 문제 해결
- 릴리즈 자동화 개선
- 워크플로우 안정성 향상

## 🔄 업그레이드 방법
별도 작업 없이 자동으로 업데이트됩니다. 브라우저를 새로고침하면 새 기능을 사용할 수 있어요!
```

### 🔧 수동 릴리즈 노트 생성
```bash
# 로컬에서 릴리즈 노트 미리보기
node scripts/generate-korean-release.js v1.1.0

# 생성된 release-notes-ko.md 파일 확인
cat release-notes-ko.md
```

### 📖 관련 문서
- [`CHANGELOG.md`](./CHANGELOG.md): 한국어 변경사항 기록
- [`docs/VERSIONING.md`](./docs/VERSIONING.md): 버전 관리 가이드라인
- [GitHub Releases](https://github.com/bulhwi/quad-chat/releases): 모든 릴리즈 목록

## 📚 추가 자료

### 🔗 관련 문서
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Socket.io 공식 문서](https://socket.io/docs/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [Vercel 배포 가이드](https://vercel.com/docs)

### 🆘 문제 해결
- **연결 문제**: 브라우저 콘솔에서 HTTP 요청 상태 확인
- **Redis 오류**: Upstash 콘솔에서 연결 상태 및 사용량 확인
- **환경변수 오류**: Vercel 대시보드에서 환경변수 설정 확인
- **모바일 이슈**: 다른 브라우저(Safari, Chrome)에서 테스트
- **배포 문제**: Vercel 대시보드에서 빌드 로그 확인

### 🤝 기여 방법
1. 이 저장소를 포크
2. 새 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👨‍💻 개발자

**박불휘 (bulhwi)**
- GitHub: [@bulhwi](https://github.com/bulhwi)
- 프로젝트: [quad-chat](https://github.com/bulhwi/quad-chat)

---

### 🙏 감사의 말

이 프로젝트는 실시간 웹 채팅의 간단하면서도 효과적인 구현을 목표로 제작되었습니다. 사용해주시고 피드백을 남겨주신 모든 분들께 감사드립니다.

🤖 **Generated with [Claude Code](https://claude.ai/code)**

---

> 💡 **팁**: 이 README는 프로젝트와 함께 지속적으로 업데이트됩니다. Star ⭐를 눌러 최신 업데이트를 받아보세요!
