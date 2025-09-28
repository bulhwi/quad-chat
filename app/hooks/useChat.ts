'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChatAPI, Room } from '@/lib/api';

interface UseChatProps {
  roomId: string;
  nickname: string;
}

export function useChat({ roomId, nickname }: UseChatProps) {
  const router = useRouter();

  // 채팅 관련 상태
  const [messages, setMessages] = useState<Room['messages']>([]);
  const [users, setUsers] = useState<Room['users']>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isRoomFull, setIsRoomFull] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [error, setError] = useState<string>('');

  // 폴링 관리
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 폴링 시작 함수
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const roomData = await ChatAPI.getRoomData(roomId);
        setMessages(roomData.messages || []);
        setUsers(roomData.users || []);
        setError('');
      } catch (err) {
        console.error('폴링 중 오류:', err);
        setError('연결에 문제가 발생했습니다.');
      }
    }, 1000);
  }, [roomId]);

  // 폴링 중지 함수
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // 방 입장 함수
  const joinRoom = useCallback(async () => {
    try {
      const response = await ChatAPI.joinRoom(roomId, nickname);
      setUserId(response.userId);
      setUsers(response.room.users);
      setIsConnected(true);
      setError('');
      startPolling();
    } catch (err) {
      console.error('방 입장 실패:', err);

      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
      if (errorMessage.includes('방이 가득')) {
        setIsRoomFull(true);
        setError('방이 가득 찼습니다. (최대 4명)');
      } else {
        setError('방 입장에 실패했습니다.');
      }
    }
  }, [roomId, nickname, startPolling]);

  // 메시지 전송 함수
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || !isConnected) return;

    try {
      await ChatAPI.sendMessage(roomId, message, userId);
      setError('');
    } catch (err) {
      console.error('메시지 전송 실패:', err);
      setError('메시지 전송에 실패했습니다.');
    }
  }, [roomId, userId, isConnected]);

  // 방 나가기 함수
  const leaveRoom = useCallback(async () => {
    try {
      stopPolling();

      // 서버에 방 퇴장 API 호출
      if (userId) {
        await ChatAPI.leaveRoom(roomId, userId);
      }

      router.push('/');
    } catch (err) {
      console.error('방 나가기 실패:', err);
      // 실패해도 페이지는 이동
      router.push('/');
    }
  }, [router, stopPolling, roomId, userId]);

  // 방 코드 복사 함수
  const copyRoomId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      // TODO: 토스트 메시지 표시
      console.log('방 코드가 복사되었습니다!');
    } catch (err) {
      console.error('복사 실패:', err);
    }
  }, [roomId]);

  // 컴포넌트 마운트 시 방 입장
  useEffect(() => {
    joinRoom();

    // 컴포넌트 언마운트 시 폴링 정리
    return () => {
      stopPolling();
    };
  }, [joinRoom, stopPolling]);

  // 페이지 이탈 시 정리 및 방 퇴장
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopPolling();

      // 방 퇴장 API 호출 (동기적으로 실행)
      if (userId) {
        // navigator.sendBeacon 사용으로 페이지 이탈 시에도 확실히 전송
        const leaveData = JSON.stringify({ action: 'leave', userId });
        navigator.sendBeacon(
          `${process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://quad-chat.vercel.app'}/api/chat/rooms/${roomId}`,
          new Blob([leaveData], { type: 'application/json' })
        );
      }
    };

    const handleVisibilityChange = () => {
      // 탭이 숨겨질 때도 방 퇴장 처리 (모바일에서 앱 전환 등)
      if (document.hidden && userId) {
        ChatAPI.leaveRoom(roomId, userId).catch(console.error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [stopPolling, roomId, userId]);

  return {
    // 상태
    messages,
    users,
    isConnected,
    isRoomFull,
    userId,
    error,

    // 액션
    sendMessage,
    leaveRoom,
    copyRoomId,
  };
}