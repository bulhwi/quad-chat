'use client';

interface ChatHeaderProps {
  roomId: string;
  userCount: number;
  isConnected: boolean;
  showSidebar: boolean;
  onToggleSidebar: () => void;
  onLeaveRoom: () => void;
}

export default function ChatHeader({
  roomId,
  userCount,
  isConnected,
  showSidebar,
  onToggleSidebar,
  onLeaveRoom,
}: ChatHeaderProps) {
  return (
    <>
      {/* 모바일 햄버거 메뉴 버튼 */}
      <button
        onClick={onToggleSidebar}
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

      {/* 상단 헤더 바 */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-800">
            채팅방 {roomId}
          </h1>
          <div className="ml-4 flex items-center text-sm text-gray-600">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {isConnected ? '연결됨' : '연결 중...'}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {userCount}/4명 참여 중
          </span>
          <button
            onClick={onLeaveRoom}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            나가기
          </button>
        </div>
      </div>
    </>
  );
}