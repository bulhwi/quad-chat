# 🗨️ Quad Chat - 실시간 4인 채팅 애플리케이션

> 최대 4명까지 참여 가능한 크로스 플랫폼 실시간 채팅 서비스

[![Live Demo](https://img.shields.io/badge/Live%20Demo-quad--chat.vercel.app-blue?style=for-the-badge)](https://quad-chat.vercel.app)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbulhwi%2Fquad-chat)

## ✨ 주요 기능

### 🔗 핵심 기능
- **4명 제한**: 방당 최대 4명까지만 입장 가능
- **실시간 채팅**: Socket.io 기반 실시간 메시지 송수신
- **크로스 플랫폼**: PC, 모바일, 태블릿 모든 기기에서 접속 가능
- **브라우저 호환**: Chrome, Safari, Firefox, Edge 등 모든 브라우저 지원

### 🎨 사용자 경험
- **직관적 UI**: 깔끔하고 사용하기 쉬운 인터페이스
- **반응형 디자인**: 모바일 최적화된 반응형 레이아웃
- **실시간 상태**: 연결 상태 및 참여자 수 실시간 표시
- **메시지 히스토리**: 늦게 참여해도 최근 메시지 확인 가능

### 📱 모바일 지원
- **터치 최적화**: 모바일 터치 인터페이스 완전 지원
- **햄버거 메뉴**: 모바일에서 사이드바 토글 기능
- **반응형 텍스트**: 화면 크기에 따른 텍스트 크기 자동 조정
- **안정적 연결**: WebSocket과 Polling 이중 지원으로 안정적 연결

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Real-time**: Socket.io Client

### Backend
- **Runtime**: Node.js
- **WebSocket**: Socket.io Server
- **Deployment**: Vercel (Serverless)

### DevOps
- **Version Control**: Git/GitHub
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel
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

#### 3️⃣ GitHub Actions 자동 배포 (이미 설정됨)

프로젝트에는 이미 GitHub Actions 워크플로우가 설정되어 있습니다:

```yaml
# .github/workflows/deploy.yml
# main 브랜치에 푸시 시 자동 배포
```

**설정 방법:**
1. GitHub 저장소 Settings → Secrets 이동
2. 다음 시크릿 추가:
   - `VERCEL_TOKEN`: Vercel 계정 토큰
   - `VERCEL_ORG_ID`: Vercel 조직 ID
   - `VERCEL_PROJECT_ID`: Vercel 프로젝트 ID

### ⚙️ 배포 환경 설정

#### 필수 설정 사항
- **Node.js 버전**: 20.x (자동 감지)
- **빌드 명령어**: `npm run build`
- **시작 명령어**: `npm start`

#### 환경변수 (선택사항)
| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `NEXT_PUBLIC_SERVER_URL` | WebSocket 서버 URL | 자동 감지 |
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
브라우저 ←→ Next.js Dev Server (3001) ←→ Custom Server (Socket.io)
```

#### 프로덕션 환경 (Vercel)
```
브라우저 ←→ Vercel Edge ←→ Next.js App ←→ API Routes (/api/socket)
                ↓
            Socket.io Serverless
```

### 🚨 배포 주의사항

1. **Socket.io 설정**: Vercel은 서버리스 환경이므로 커스텀 서버 대신 API Routes 사용
2. **CORS 설정**: 모든 오리진 허용으로 설정됨 (`origin: "*"`)
3. **세션 저장소**: 메모리 기반이므로 서버 재시작 시 방 정보 초기화
4. **스케일링**: 서버리스 특성상 각 함수는 독립적으로 실행

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
- **브라우저 콘솔**: Socket.io 연결 상태 확인
- **Network 탭**: WebSocket 연결 모니터링

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
│   └── 📁 hooks/                  # React 커스텀 훅
│       └── 📄 useSocket.ts       # Socket.io 훅
├── 📁 pages/                      # Pages Router (API 전용)
│   └── 📁 api/
│       └── 📄 socket.js          # Socket.io 서버 (Vercel 호환)
├── 📁 lib/                        # 유틸리티 라이브러리
│   └── 📄 socket.ts              # Socket.io 클라이언트 설정
├── 📁 types/                      # TypeScript 타입 정의
│   ├── 📄 chat.ts                # 채팅 관련 타입
│   └── 📄 socket.ts              # Socket.io 타입
├── 📁 .github/workflows/          # GitHub Actions
│   └── 📄 deploy.yml             # 자동 배포 워크플로우
├── 📄 server.js                   # 로컬 개발용 커스텀 서버
├── 📄 package.json               # 프로젝트 설정
├── 📄 tailwind.config.ts         # Tailwind CSS 설정
├── 📄 tsconfig.json              # TypeScript 설정
└── 📄 next.config.js             # Next.js 설정
```

### 🔧 주요 파일 설명

| 파일 | 역할 |
|------|------|
| `app/page.tsx` | 메인 페이지: 닉네임 입력, 방 생성/참여 |
| `app/chat/[roomId]/page.tsx` | 채팅방: 실시간 채팅 인터페이스 |
| `pages/api/socket.js` | Socket.io 서버: Vercel serverless 환경 |
| `lib/socket.ts` | Socket.io 클라이언트: 연결 관리 |
| `server.js` | 로컬 개발 서버: Socket.io + Next.js |

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

### 🔄 일반적인 개발 과정

```bash
# 1. 저장소 클론
git clone https://github.com/bulhwi/quad-chat.git
cd quad-chat

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 코드 수정 및 테스트
# http://localhost:3001에서 실시간 확인

# 5. 빌드 테스트
npm run build

# 6. 변경사항 커밋
git add .
git commit -m "feat: 새로운 기능 추가"

# 7. GitHub에 푸시 (자동 배포)
git push origin main
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

## 📚 추가 자료

### 🔗 관련 문서
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Socket.io 공식 문서](https://socket.io/docs/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [Vercel 배포 가이드](https://vercel.com/docs)

### 🆘 문제 해결
- **연결 문제**: 브라우저 콘솔에서 Socket.io 연결 상태 확인
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
