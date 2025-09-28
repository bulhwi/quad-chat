'use client';

// 1. 필요한 React 훅과 Next.js 모듈 가져오기
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. 메인 페이지 컴포넌트
export default function Home() {
  // 2-1. 페이지 이동을 위한 라우터
  const router = useRouter();

  // 2-2. 상태 관리
  const [nickname, setNickname] = useState('');    // 사용자 닉네임
  const [roomId, setRoomId] = useState('');        // 참여할 방 코드
  const [isJoining, setIsJoining] = useState(false); // 방 참여 모드 여부

  // 3. 랜덤 방 ID 생성 함수
  const generateRoomId = () => {
    // 3-1. 영문+숫자 조합으로 7자리 랜덤 문자열 생성
    return Math.random().toString(36).substring(2, 9);
  };

  // 4. 새 방 만들기 함수
  const handleCreateRoom = () => {
    // 4-1. 닉네임 입력 검증
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요');
      return;
    }

    // 4-2. 새 방 ID 생성 후 채팅방으로 이동
    const newRoomId = generateRoomId();
    router.push(`/chat/${newRoomId}?nickname=${encodeURIComponent(nickname)}`);
  };

  // 5. 기존 방 참여 함수
  const handleJoinRoom = () => {
    // 5-1. 방 코드 입력 검증
    if (!roomId.trim()) {
      alert('방 코드를 입력해주세요');
      return;
    }

    // 5-2. 닉네임 입력 검증
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요');
      return;
    }

    // 5-3. 입력받은 방 ID로 채팅방 이동
    router.push(`/chat/${roomId}?nickname=${encodeURIComponent(nickname)}`);
  };

  // ============================================
  // 6. UI 렌더링 부분
  // ============================================
  return (
    {/* 6-1. 메인 컨테이너 (전체 화면, 중앙 정렬, 그라데이션 배경) */}
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md px-4 sm:px-0">
        {/* 6-2. 메인 카드 컨테이너 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* 6-2-1. 제목 및 설명 */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-800">
            Quad Talk
          </h1>
          <p className="text-sm sm:text-base text-center text-gray-600 mb-6 sm:mb-8">
            최대 4명까지 참여 가능한 실시간 채팅
          </p>

          {/* 6-2-2. 입력 폼 영역 */}
          <div className="space-y-4">
            {/* 닉네임 입력창 */}
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              maxLength={20}
            />

            {/* 6-2-3. 조건부 렌더링: 메인 화면 vs 방 참여 화면 */}
            {!isJoining ? (
              /* 6-2-3-1. 메인 화면 (방 만들기/참여하기 선택) */
              <>
                {/* 새 방 만들기 버튼 */}
                <button
                  onClick={handleCreateRoom}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  새 방 만들기
                </button>

                {/* 구분선 */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">또는</span>
                  </div>
                </div>

                {/* 기존 방 참여하기 버튼 */}
                <button
                  onClick={() => setIsJoining(true)}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  기존 방 참여하기
                </button>
              </>
            ) : (
              /* 6-2-3-2. 방 참여 화면 (방 코드 입력) */
              <>
                {/* 방 코드 입력창 */}
                <input
                  type="text"
                  placeholder="방 코드를 입력하세요"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                />

                {/* 방 참여하기 버튼 */}
                <button
                  onClick={handleJoinRoom}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  방 참여하기
                </button>

                {/* 뒤로 가기 버튼 */}
                <button
                  onClick={() => {
                    setIsJoining(false);  // 메인 화면으로 돌아가기
                    setRoomId('');        // 입력했던 방 코드 초기화
                  }}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  뒤로 가기
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
