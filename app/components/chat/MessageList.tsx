'use client';

import { useEffect, useRef } from 'react';
import { Room } from '@/lib/api';

interface MessageListProps {
  messages: Room['messages'];
  currentUserId: string;
}

export default function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">💬</p>
            <p>아직 메시지가 없습니다.</p>
            <p className="text-sm">첫 메시지를 보내보세요!</p>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.userId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl ${
                message.userId === currentUserId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {/* 다른 사용자의 메시지인 경우 닉네임 표시 */}
              {message.userId !== currentUserId && (
                <p className="text-xs font-medium mb-1 opacity-70">
                  {message.nickname}
                </p>
              )}

              {/* 메시지 내용 */}
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message.message}
              </p>

              {/* 시간 표시 */}
              <p
                className={`text-xs mt-1 ${
                  message.userId === currentUserId ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))
      )}

      {/* 스크롤 타겟 요소 */}
      <div ref={messagesEndRef} />
    </div>
  );
}