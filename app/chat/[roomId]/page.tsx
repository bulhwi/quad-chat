'use client';

import { use, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useChat } from '@/app/hooks/useChat';
import ChatHeader from '@/app/components/chat/ChatHeader';
import ChatSidebar from '@/app/components/chat/ChatSidebar';
import MessageList from '@/app/components/chat/MessageList';
import MessageInput from '@/app/components/chat/MessageInput';

interface ChatPageProps {
  params: Promise<{ roomId: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { roomId } = use(params);
  const searchParams = useSearchParams();
  const nickname = searchParams?.get('nickname') || 'Anonymous';

  // 사이드바 표시 상태
  const [showSidebar, setShowSidebar] = useState(false);

  // 채팅 로직 훅
  const {
    messages,
    users,
    isConnected,
    isRoomFull,
    userId,
    error,
    sendMessage,
    leaveRoom,
    copyRoomId,
  } = useChat({ roomId, nickname });

  // 방이 가득 찬 경우 에러 화면 표시
  if (isRoomFull) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">방이 가득 찼습니다</h1>
          <p className="text-gray-600 mb-6">
            이 방은 이미 4명이 참여하고 있습니다.
            <br />
            다른 방을 이용해 주세요.
          </p>
          <button
            onClick={leaveRoom}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 에러가 있는 경우 에러 화면 표시
  if (error && !isConnected) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">연결 오류</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={leaveRoom}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* 사이드바 */}
      <ChatSidebar
        roomId={roomId}
        users={users}
        currentUserId={userId}
        showSidebar={showSidebar}
        onCloseSidebar={() => setShowSidebar(false)}
        onCopyRoomId={copyRoomId}
      />

      {/* 메인 채팅 영역 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 헤더 */}
        <ChatHeader
          roomId={roomId}
          userCount={users.length}
          isConnected={isConnected}
          showSidebar={showSidebar}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          onLeaveRoom={leaveRoom}
        />

        {/* 메시지 목록 */}
        <MessageList
          messages={messages}
          currentUserId={userId}
        />

        {/* 메시지 입력 */}
        <MessageInput
          onSendMessage={sendMessage}
          disabled={!isConnected}
        />

        {/* 에러 메시지 표시 (연결된 상태에서) */}
        {error && isConnected && (
          <div className="bg-red-50 border-t border-red-200 p-3">
            <p className="text-red-700 text-sm text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}