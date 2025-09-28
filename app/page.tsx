'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  const handleCreateRoom = () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요');
      return;
    }
    const newRoomId = generateRoomId();
    router.push(`/chat/${newRoomId}?nickname=${encodeURIComponent(nickname)}`);
  };

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      alert('방 코드를 입력해주세요');
      return;
    }
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요');
      return;
    }
    router.push(`/chat/${roomId}?nickname=${encodeURIComponent(nickname)}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Quad Talk
          </h1>
          <p className="text-center text-gray-600 mb-8">
            최대 4명까지 참여 가능한 실시간 채팅
          </p>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              maxLength={20}
            />

            {!isJoining ? (
              <>
                <button
                  onClick={handleCreateRoom}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  새 방 만들기
                </button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">또는</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsJoining(true)}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  기존 방 참여하기
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="방 코드를 입력하세요"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                />
                <button
                  onClick={handleJoinRoom}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  방 참여하기
                </button>
                <button
                  onClick={() => {
                    setIsJoining(false);
                    setRoomId('');
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
