# Quad Chat - 실시간 4인 채팅 애플리케이션

최대 4명까지 참여 가능한 실시간 채팅 애플리케이션입니다.

## 주요 기능

- ✨ 최대 4명까지 참여 가능한 채팅방
- 🚀 실시간 메시지 전송 (Socket.io)
- 🎨 깔끔한 UI/UX (Tailwind CSS)
- 📱 반응형 디자인
- 🔐 방 코드를 통한 참여
- 👥 참여자 목록 실시간 표시
- 💬 닉네임 설정 기능

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Node.js, Socket.io
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

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

## 배포

이 애플리케이션은 Vercel에 배포 가능합니다.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbulhwi%2Fquad-chat)

### Vercel 배포 방법

1. 위 버튼 클릭 또는 [Vercel](https://vercel.com) 접속
2. GitHub 계정으로 로그인
3. "Import Project" 클릭
4. GitHub 저장소 `bulhwi/quad-chat` 선택
5. 배포 설정:
   - Framework Preset: Next.js
   - Root Directory: `.` (기본값)
6. "Deploy" 클릭

### 환경변수 설정 (선택사항)

프로덕션 환경에서는 다음 환경변수를 설정할 수 있습니다:
- `NEXT_PUBLIC_SERVER_URL`: WebSocket 서버 URL (기본값: 자동 설정)

## 사용 방법

1. **방 생성하기**
   - 닉네임 입력
   - "새 방 만들기" 클릭
   - 생성된 방 코드 공유

2. **방 참여하기**
   - 닉네임 입력
   - "기존 방 참여하기" 클릭
   - 방 코드 입력
   - "방 참여하기" 클릭

## 프로젝트 구조

```
quad-chat/
├── app/                    # Next.js 앱 라우터
│   ├── page.tsx           # 메인 페이지
│   ├── chat/[roomId]/     # 채팅방 페이지
│   └── api/               # API 라우트
├── lib/                   # 유틸리티 함수
│   └── socket.ts         # Socket.io 클라이언트
├── types/                 # TypeScript 타입 정의
├── server.js             # 커스텀 서버 (로컬용)
└── package.json
```

## 스크립트

- `npm run dev`: 개발 서버 실행 (커스텀 서버)
- `npm run dev:next`: Next.js 개발 서버
- `npm run build`: 프로덕션 빌드
- `npm start`: 프로덕션 서버 실행
- `npm run lint`: 린트 실행

## 라이선스

MIT

## 개발자

- GitHub: [@bulhwi](https://github.com/bulhwi)

---

🤖 Generated with [Claude Code](https://claude.ai/code)
