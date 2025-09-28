#!/usr/bin/env node

/**
 * 한국어 릴리즈 노트 자동 생성 스크립트
 *
 * 사용법: node scripts/generate-korean-release.js v1.1.0
 *
 * 기능:
 * 1. CHANGELOG.md에서 해당 버전의 변경사항 추출
 * 2. 한국어 친화적인 릴리즈 노트 템플릿 적용
 * 3. GitHub Release용 마크다운 파일 생성
 */

const fs = require('fs');
const path = require('path');

// 한국어 기술 용어 매핑
const koreanTerms = {
  'Breaking Changes': '호환성 중단 변경사항',
  'Migration': '업그레이드 방법',
  'Deprecated': '사용 중단 예정',
  'Performance': '성능 최적화',
  'Security': '보안 강화',
  'Bug Fix': '오류 수정',
  'Added': '추가됨',
  'Changed': '변경됨',
  'Fixed': '수정됨',
  'Removed': '제거됨'
};

// 버전별 이모지 매핑
const versionEmojis = {
  major: '🚀',  // 1.0.0, 2.0.0
  minor: '✨',  // 1.1.0, 1.2.0
  patch: '🐛'   // 1.0.1, 1.0.2
};

/**
 * 버전 타입 결정 (major, minor, patch)
 */
function getVersionType(version) {
  const [major, minor, patch] = version.replace('v', '').split('.').map(Number);

  if (patch > 0) return 'patch';
  if (minor > 0) return 'minor';
  return 'major';
}

/**
 * CHANGELOG.md에서 특정 버전의 변경사항 추출
 */
function extractChangelogForVersion(version) {
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');

  if (!fs.existsSync(changelogPath)) {
    console.error('❌ CHANGELOG.md 파일을 찾을 수 없습니다.');
    process.exit(1);
  }

  const changelog = fs.readFileSync(changelogPath, 'utf8');
  const lines = changelog.split('\n');

  let inTargetVersion = false;
  let changes = [];

  for (const line of lines) {
    // 버전 헤더 찾기 (예: ## [1.0.0] - 2024-12-28)
    if (line.startsWith('## [') && line.includes(version.replace('v', ''))) {
      inTargetVersion = true;
      continue;
    }

    // 다음 버전 헤더에 도달하면 종료
    if (inTargetVersion && line.startsWith('## [')) {
      break;
    }

    // 타겟 버전의 내용 수집
    if (inTargetVersion && line.trim()) {
      changes.push(line);
    }
  }

  return changes.join('\n');
}

/**
 * 버전별 맞춤 제목 생성
 */
function generateVersionTitle(version) {
  const versionType = getVersionType(version);
  const emoji = versionEmojis[versionType];

  const titles = {
    major: `${emoji} Quad Chat ${version} - 메이저 업데이트`,
    minor: `${emoji} Quad Chat ${version} - 새로운 기능 추가`,
    patch: `${emoji} Quad Chat ${version} - 버그 수정 및 개선`
  };

  return titles[versionType];
}

/**
 * 한국어 친화적인 릴리즈 노트 생성
 */
function generateKoreanReleaseNotes(version, changes) {
  const versionType = getVersionType(version);
  const title = generateVersionTitle(version);

  // 기본 템플릿
  let releaseNotes = `# ${title}

안녕하세요! Quad Chat의 새로운 업데이트가 출시되었습니다! 🎉

${changes}

## 🔄 업그레이드 방법
별도 작업 없이 자동으로 업데이트됩니다. 브라우저를 새로고침하면 새 기능을 사용할 수 있어요!

## 🔗 접속하기
- **웹사이트**: [https://quad-chat.vercel.app](https://quad-chat.vercel.app)
- **스마트폰**: 브라우저에서 "홈 화면에 추가" 선택
- **GitHub**: [https://github.com/bulhwi/quad-chat](https://github.com/bulhwi/quad-chat)

## 📞 문의 및 피드백
궁금한 점이나 문제가 있으시면 언제든 [GitHub Issues](https://github.com/bulhwi/quad-chat/issues)에 남겨주세요!

---
🤖 **이 릴리즈 노트는 자동으로 생성되었습니다.**

**Generated with [Claude Code](https://claude.ai/code)**

Co-Authored-By: Claude <noreply@anthropic.com>`;

  return releaseNotes;
}

/**
 * 메인 실행 함수
 */
function main() {
  const version = process.argv[2];

  if (!version) {
    console.error('❌ 사용법: node scripts/generate-korean-release.js v1.1.0');
    process.exit(1);
  }

  console.log(`🚀 ${version} 버전의 한국어 릴리즈 노트를 생성합니다...`);

  try {
    // CHANGELOG.md에서 변경사항 추출
    const changes = extractChangelogForVersion(version);

    if (!changes.trim()) {
      console.error(`❌ ${version} 버전의 변경사항을 CHANGELOG.md에서 찾을 수 없습니다.`);
      process.exit(1);
    }

    // 한국어 릴리즈 노트 생성
    const releaseNotes = generateKoreanReleaseNotes(version, changes);

    // 파일로 저장
    const outputPath = path.join(process.cwd(), 'release-notes-ko.md');
    fs.writeFileSync(outputPath, releaseNotes, 'utf8');

    console.log(`✅ 한국어 릴리즈 노트가 생성되었습니다: ${outputPath}`);
    console.log('\n📝 생성된 내용:');
    console.log('='.repeat(50));
    console.log(releaseNotes);

  } catch (error) {
    console.error('❌ 릴리즈 노트 생성 중 오류 발생:', error.message);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  main();
}