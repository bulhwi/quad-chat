# 🏷️ Quad Chat 버전 관리 가이드

이 문서는 Quad Chat 프로젝트의 버전 관리 정책과 릴리즈 프로세스를 설명합니다.

## 📋 버전 관리 원칙

### Semantic Versioning (SemVer) 적용
Quad Chat은 [유의적 버전 관리](https://semver.org/lang/ko/)를 따릅니다.

**버전 형식**: `MAJOR.MINOR.PATCH` (예: 1.2.3)

### 버전 증가 규칙

#### 🚀 MAJOR 버전 (1.0.0 → 2.0.0)
- **호환성 중단 변경사항** 포함
- 기존 API나 기능의 중대한 변경
- 사용자가 코드 수정이 필요할 수 있음

**예시**:
- 채팅 방식 변경 (HTTP Polling → WebSocket)
- 데이터 저장 구조 변경
- 필수 환경변수 변경

#### ✨ MINOR 버전 (1.0.0 → 1.1.0)
- **새로운 기능 추가** (기존 기능과 호환)
- 기존 사용자에게 영향 없음
- 선택적으로 사용 가능한 개선사항

**예시**:
- 이모티콘 기능 추가
- 이미지 첨부 기능 추가
- 새로운 알림 옵션

#### 🐛 PATCH 버전 (1.0.0 → 1.0.1)
- **버그 수정 및 성능 개선**
- 기능 변경 없음
- 보안 패치 포함

**예시**:
- 메시지 전송 오류 수정
- 모바일 레이아웃 개선
- 메모리 누수 수정

## 🇰🇷 한국어 우선 릴리즈 정책

### 작성 원칙
1. **한국어 우선**: 모든 릴리즈 노트는 한국어로 먼저 작성
2. **사용자 친화적**: 기술 용어보다 일반 사용자가 이해하기 쉬운 표현
3. **구체적 설명**: "개선됨"보다 "로딩 속도 50% 향상" 같은 구체적 정보
4. **이모지 활용**: 시각적 구분을 위한 적절한 이모지 사용

### 한국어 기술 용어 표준
| 영어 용어 | 한국어 용어 |
|----------|-----------|
| Breaking Changes | 호환성 중단 변경사항 |
| Migration | 업그레이드 방법 |
| Deprecated | 사용 중단 예정 |
| Performance | 성능 최적화 |
| Security | 보안 강화 |
| Bug Fix | 오류 수정 |

## 📅 릴리즈 일정 계획

### 현재 로드맵 (v1.x 시리즈)
- **v1.0.0** ✅ - 기본 채팅 시스템 (완료)
- **v1.1.0** 🎭 - 이모티콘 기능
- **v1.2.0** 📷 - 이미지 첨부 기능
- **v1.3.0** 📱 - 모바일 동작 개선
- **v1.4.0** 🔔 - 채팅 알림 기능
- **v1.5.0** ⌨️ - 실시간 타이핑 인디케이터

### 릴리즈 주기
- **MAJOR**: 6개월 ~ 1년 간격
- **MINOR**: 2주 ~ 1개월 간격
- **PATCH**: 필요에 따라 즉시 (긴급 버그 수정)

## 🔄 릴리즈 프로세스

### 1. 개발 및 테스트
```bash
# 기능 브랜치에서 개발
git checkout -b feature/emoji-support
# 개발 완료 후 develop 브랜치로 PR
git checkout develop
git merge feature/emoji-support
```

### 2. 릴리즈 준비
```bash
# CHANGELOG.md 업데이트
# package.json 버전 업데이트
npm version minor  # 또는 major, patch
```

### 3. 릴리즈 배포
```bash
# 태그 생성 및 푸시 (GitHub Actions 자동 실행)
git tag v1.1.0
git push origin v1.1.0
```

### 4. 자동화된 과정
- 🤖 GitHub Actions가 한국어 릴리즈 노트 자동 생성
- 📝 CHANGELOG.md 내용 기반으로 템플릿 적용
- 🚀 GitHub Releases에 자동 게시
- 📧 관련 팀원들에게 알림

## 📝 CHANGELOG.md 관리

### 업데이트 시점
- 각 기능 개발 완료 시 즉시 업데이트
- 릴리즈 전 최종 검토 및 정리

### 작성 형식
```markdown
## [1.1.0] - 2024-12-29 - 🎭 이모티콘 업데이트

### 추가됨
- 30개 이모티콘 지원 😀 😢 ❤️ 등
- 이모티콘 선택 버튼 추가

### 개선사항
- 채팅 입력창 사용성 향상
- 메시지 표시 속도 20% 개선
```

## 🔧 도구 및 스크립트

### 한국어 릴리즈 노트 생성
```bash
# 자동 생성 스크립트 실행
node scripts/generate-korean-release.js v1.1.0
```

### 버전 확인
```bash
# 현재 버전 확인
npm version
```

## 🚨 비상 릴리즈 (Hotfix)

### 긴급 버그 수정 시
1. **main 브랜치에서 hotfix 브랜치 생성**
2. **버그 수정 및 PATCH 버전 증가**
3. **즉시 배포 및 develop 브랜치에 반영**

```bash
git checkout main
git checkout -b hotfix/security-fix
# 수정 작업
npm version patch
git tag v1.0.1
git push origin v1.0.1
```

## 📊 버전 히스토리 추적

### GitHub Releases 활용
- 모든 릴리즈는 GitHub Releases에 기록
- 한국어 릴리즈 노트 첨부
- 다운로드 통계 추적

### 메트릭 수집
- 버전별 사용자 피드백 수집
- 업그레이드율 모니터링
- 성능 개선 효과 측정

---

**참고 문서**:
- [Semantic Versioning 공식 사이트](https://semver.org/lang/ko/)
- [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

**문의사항**:
버전 관리와 관련된 질문은 [GitHub Issues](https://github.com/bulhwi/quad-chat/issues)에 남겨주세요!