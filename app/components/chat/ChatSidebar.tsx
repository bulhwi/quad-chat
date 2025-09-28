'use client';

import { Room } from '@/lib/api';

interface ChatSidebarProps {
  roomId: string;
  users: Room['users'];
  currentUserId: string;
  showSidebar: boolean;
  onCloseSidebar: () => void;
  onCopyRoomId: () => void;
}

export default function ChatSidebar({
  roomId,
  users,
  currentUserId,
  showSidebar,
  onCloseSidebar,
  onCopyRoomId,
}: ChatSidebarProps) {
  return (
    <>
      {/* 모바일 오버레이 */}
      {showSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onCloseSidebar}
        />
      )}

      {/* 사이드바 */}
      <div className={`fixed lg:relative lg:block ${showSidebar ? 'block' : 'hidden'} w-64 h-full bg-white border-r border-gray-200 p-4 z-40 lg:z-0`}>

        {/* 방 정보 */}
        <div className="mb-6 mt-14 lg:mt-0">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">방 정보</h2>
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">방 코드</p>
            <div className="flex items-center justify-between">
              <p className="font-mono font-bold text-gray-800">{roomId}</p>
              <button
                onClick={onCopyRoomId}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                복사
              </button>
            </div>
          </div>
        </div>

        {/* 참여자 목록 */}
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
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3 ${
                    user.id === currentUserId ? 'bg-blue-500' : 'bg-gray-400'
                  }`}
                >
                  {user.nickname.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {user.nickname}
                    {user.id === currentUserId && (
                      <span className="ml-1 text-xs text-blue-600">(나)</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(user.joinedAt).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })} 참여
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 도움말 */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium mb-2">💡 사용법</h4>
          <ul className="space-y-1">
            <li>• 최대 4명까지 참여 가능</li>
            <li>• 방 코드를 친구에게 공유하세요</li>
            <li>• 24시간 후 자동으로 삭제됩니다</li>
          </ul>
        </div>
      </div>
    </>
  );
}