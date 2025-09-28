'use client';

// 1. 필요한 React 훅과 Next.js 모듈 가져오기
import { useEffect, useState, useRef, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatAPI, Room } from '@/lib/api';

// 2. 페이지 컴포넌트 props 타입 정의
interface ChatPageProps {
  params: Promise<{ roomId: string }>; // 동적 라우트에서 roomId 파라미터
}

// 3. 채팅 페이지 메인 컴포넌트
export default function ChatPage({ params }: ChatPageProps) {
  // 3-1. URL 파라미터 및 라우터 관련 훅
  const { roomId } = use(params);                                    // 방 ID 추출
  const router = useRouter();                                        // 페이지 이동용
  const searchParams = useSearchParams();                           // URL 쿼리 파라미터
  const nickname = searchParams?.get('nickname') || 'Anonymous';    // 닉네임 (없으면 Anonymous)

  // 3-2. 채팅 관련 상태 관리
  const [messages, setMessages] = useState<Room['messages']>([]);   // 메시지 목록
  const [inputMessage, setInputMessage] = useState('');             // 입력 중인 메시지
  const [users, setUsers] = useState<Room['users']>([]);            // 방 사용자 목록
  const [isConnected, setIsConnected] = useState(false);            // 연결 상태
  const [isRoomFull, setIsRoomFull] = useState(false);              // 방 만실 상태
  const [showSidebar, setShowSidebar] = useState(false);            // 사이드바 표시 여부
  const [userId, setUserId] = useState<string>('');                 // 현재 사용자 ID
  const [error, setError] = useState<string>('');                   // 에러 메시지

  // 3-3. 참조(ref) 객체들
  const messagesEndRef = useRef<HTMLDivElement>(null);              // 메시지 스크롤용
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);   // 폴링 인터벌 관리

  // 4. 방 입장 처리 (컴포넌트 마운트 시 실행)
  useEffect(() => {
    // 4-1. 방 입장 함수 정의
    const joinRoom = async () => {
      try {
        // 4-1-1. API 호출하여 방에 입장 시도
        const response = await ChatAPI.joinRoom(roomId, nickname);

        // 4-1-2. 성공 시 상태 업데이트
        setUserId(response.userId);        // 서버에서 받은 사용자 ID 저장
        setUsers(response.room.users);     // 방의 현재 사용자 목록 저장
        setIsConnected(true);              // 연결 상태를 true로 설정
        setError('');                      // 에러 메시지 초기화

        // 4-1-3. 실시간 업데이트를 위한 폴링 시작
        startPolling();
      } catch (error: unknown) {
        // 4-1-4. 에러 처리
        console.error('Failed to join room:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        if (errorMessage.includes('full')) {
          setIsRoomFull(true);             // 방이 꽉 찬 경우
        } else {
          setError(errorMessage);          // 기타 에러
        }
      }
    };

    // 4-2. 방 입장 함수 실행
    joinRoom();

    // 4-3. 컴포넌트 언마운트 시 정리 작업
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current); // 폴링 인터벌 정리
      }
    };
  }, [roomId, nickname]); // roomId나 nickname이 변경되면 재실행

  // 5. 컴포넌트 언마운트 시 방 나가기 처리
  useEffect(() => {
    return () => {
      // 5-1. 사용자 ID가 있으면 방에서 나가기 API 호출
      if (userId) {
        ChatAPI.leaveRoom(roomId, userId).catch(console.error);
      }
    };
  }, [userId, roomId]); // userId나 roomId가 변경되면 재실행

  // 6. HTTP 폴링 시작 함수
  // - WebSocket 대신 HTTP 요청으로 실시간 업데이트 구현
  const startPolling = () => {
    // 6-1. 1초마다 방 데이터를 조회하는 인터벌 설정
    pollingIntervalRef.current = setInterval(async () => {
      try {
        // 6-1-1. 서버에서 최신 방 데이터 가져오기
        const roomData = await ChatAPI.getRoomData(roomId);
        setUsers(roomData.users);           // 사용자 목록 업데이트
        setMessages(roomData.messages);     // 메시지 목록 업데이트
        setIsConnected(true);               // 연결 상태 유지
      } catch (error) {
        // 6-1-2. 폴링 에러 시 연결 끊김으로 표시
        console.error('Polling error:', error);
        setIsConnected(false);
      }
    }, 1000); // 1초 간격
  };

  // 7. 메시지 목록이 변경될 때마다 스크롤 최하단으로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // messages 배열이 변경될 때마다 실행

  // 8. 메시지 전송 함수
  const sendMessage = async () => {
    // 8-1. 입력값 검증 (빈 메시지나 사용자 ID 없으면 실행 안함)
    if (!inputMessage.trim() || !userId) return;

    try {
      // 8-2. 서버에 메시지 전송
      await ChatAPI.sendMessage(roomId, userId, inputMessage);
      setInputMessage('');                // 입력창 초기화
      setError('');                       // 에러 메시지 초기화

      // 8-3. 즉시 최신 메시지 목록을 가져와서 UI 업데이트
      const roomData = await ChatAPI.getRoomData(roomId);
      setMessages(roomData.messages);
    } catch (error: unknown) {
      // 8-4. 전송 실패 시 에러 처리
      console.error('Failed to send message:', error);
      setError('메시지 전송에 실패했습니다.');
    }
  };

  // 9. 키보드 이벤트 처리 함수
  const handleKeyPress = (e: React.KeyboardEvent) => {
    // 9-1. Enter 키 누르면 메시지 전송 (Shift+Enter는 제외)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();  // 기본 Enter 동작(줄바꿈) 방지
      sendMessage();       // 메시지 전송
    }
  };

  // 10. 방 코드 복사 함수
  const copyRoomId = () => {
    // 10-1. 클립보드에 방 ID 복사
    navigator.clipboard.writeText(roomId);
    alert(`방 코드 '${roomId}'가 복사되었습니다!`);
  };

  // 11. 방 나가기 함수
  const leaveRoom = async () => {
    // 11-1. 사용자 확인 후 방 나가기 처리
    if (confirm('방을 나가시겠습니까?')) {
      if (userId) {
        await ChatAPI.leaveRoom(roomId, userId); // 서버에 나가기 요청
      }
      router.push('/'); // 메인 페이지로 이동
    }
  };

  // ============================================
  // 12. UI 렌더링 부분
  // ============================================

  // 12-1. 방이 가득 찬 경우 화면
  if (isRoomFull) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center p-6 sm:p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">방이 가득 찼습니다</h2>
          <p className="mb-4 text-sm sm:text-base">최대 4명까지만 입장 가능합니다.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 12-2. 연결 오류 화면
  if (error && !isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center p-6 sm:p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">연결 오류</h2>
          <p className="mb-4 text-sm sm:text-base text-red-600">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 12-3. 메인 채팅 화면 렌더링
  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* 12-3-1. 모바일 햄버거 메뉴 버튼 */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {showSidebar ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar - desktop and mobile */}
      <div className={`fixed lg:relative lg:block ${showSidebar ? 'block' : 'hidden'} w-64 h-full bg-white border-r border-gray-200 p-4 z-40 lg:z-0`}>
        <div className="mb-6 mt-14 lg:mt-0">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">방 정보</h2>
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">방 코드</p>
            <div className="flex items-center justify-between">
              <p className="font-mono font-bold text-gray-800">{roomId}</p>
              <button
                onClick={copyRoomId}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                복사
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            참여자 ({users.length}/4)
          </h3>
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-2 bg-gray-50 rounded-lg"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">{user.nickname}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center mb-4">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? '연결됨' : '연결 끊김'}
            </span>
          </div>
          <button
            onClick={leaveRoom}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            방 나가기
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col w-full">
        <div className="bg-white border-b border-gray-200 px-6 py-4 pl-16 lg:pl-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Quad Talk</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              아직 메시지가 없습니다. 대화를 시작해보세요!
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.userId === userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                      msg.userId === userId
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {msg.userId !== userId && (
                      <p className="text-xs font-semibold mb-1 opacity-75">
                        {msg.nickname}
                      </p>
                    )}
                    <p className="break-words">{msg.message}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(msg.timestamp).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="bg-white border-t border-gray-200 p-3 sm:p-4">
          {error && (
            <div className="mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              disabled={!isConnected}
            />
            <button
              onClick={sendMessage}
              disabled={!isConnected || !inputMessage.trim()}
              className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}