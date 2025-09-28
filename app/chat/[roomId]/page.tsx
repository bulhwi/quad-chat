'use client';

import { useEffect, useState, useRef, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatAPI, Room } from '@/lib/api';

interface ChatPageProps {
  params: Promise<{ roomId: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { roomId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nickname = searchParams?.get('nickname') || 'Anonymous';

  const [messages, setMessages] = useState<Room['messages']>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [users, setUsers] = useState<Room['users']>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isRoomFull, setIsRoomFull] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Join room on mount
  useEffect(() => {
    const joinRoom = async () => {
      try {
        const response = await ChatAPI.joinRoom(roomId, nickname);
        setUserId(response.userId);
        setUsers(response.room.users);
        setIsConnected(true);
        setError('');

        // Start polling for updates
        startPolling();
      } catch (error: unknown) {
        console.error('Failed to join room:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (errorMessage.includes('full')) {
          setIsRoomFull(true);
        } else {
          setError(errorMessage);
        }
      }
    };

    joinRoom();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [roomId, nickname]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (userId) {
        ChatAPI.leaveRoom(roomId, userId).catch(console.error);
      }
    };
  }, [userId, roomId]);

  const startPolling = () => {
    // Poll for room updates every 1 second
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const roomData = await ChatAPI.getRoomData(roomId);
        setUsers(roomData.users);
        setMessages(roomData.messages);
        setIsConnected(true);
      } catch (error) {
        console.error('Polling error:', error);
        setIsConnected(false);
      }
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !userId) return;

    try {
      await ChatAPI.sendMessage(roomId, userId, inputMessage);
      setInputMessage('');
      setError('');

      // Immediately fetch latest messages
      const roomData = await ChatAPI.getRoomData(roomId);
      setMessages(roomData.messages);
    } catch (error: unknown) {
      console.error('Failed to send message:', error);
      setError('메시지 전송에 실패했습니다.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert(`방 코드 '${roomId}'가 복사되었습니다!`);
  };

  const leaveRoom = async () => {
    if (confirm('방을 나가시겠습니까?')) {
      if (userId) {
        await ChatAPI.leaveRoom(roomId, userId);
      }
      router.push('/');
    }
  };

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

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Mobile menu button */}
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