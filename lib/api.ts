// API client for HTTP polling instead of Socket.io

// 1. 기본 사용자 타입 정의
export interface User {
  id: string;
  nickname: string;
  joinedAt: string;
}

// 2. 메시지 타입 정의
export interface Message {
  id: string;
  userId: string;
  nickname: string;
  message: string;
  timestamp: string;
}

// 3. 방 데이터 타입 정의
export interface Room {
  users: User[];
  messages: Message[];
}

// 4. API 응답 타입들
export interface JoinRoomResponse {
  success: boolean;
  userId: string;
  room: {
    users: User[];
    userCount: number;
  };
}

export interface SendMessageResponse {
  success: boolean;
  message: Message;
}

export interface LeaveRoomResponse {
  success: boolean;
}

// 5. API 에러 응답 타입
export interface APIError {
  error: string;
  details?: string;
}

// 6. API 기본 설정
const API_BASE = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001'
  : '';

// 7. HTTP Polling 기반 채팅 API 클래스
export class ChatAPI {
  // 6-1. 방 입장 API
  static async joinRoom(roomId: string, nickname: string): Promise<JoinRoomResponse> {
    const response = await fetch(`${API_BASE}/api/rooms/${roomId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'join',
        nickname
      })
    });

    if (!response.ok) {
      const error: APIError = await response.json();
      throw new Error(error.error || 'Failed to join room');
    }

    return response.json();
  }

  // 6-2. 방 데이터 조회 API (폴링용)
  static async getRoomData(roomId: string): Promise<Room> {
    const response = await fetch(`${API_BASE}/api/rooms/${roomId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error: APIError = await response.json();
      throw new Error(error.error || 'Failed to get room data');
    }

    return response.json();
  }

  // 6-3. 메시지 전송 API
  static async sendMessage(roomId: string, userId: string, message: string): Promise<SendMessageResponse> {
    const response = await fetch(`${API_BASE}/api/rooms/${roomId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        message
      })
    });

    if (!response.ok) {
      const error: APIError = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    return response.json();
  }

  // 6-4. 방 나가기 API
  static async leaveRoom(roomId: string, userId: string): Promise<LeaveRoomResponse> {
    const response = await fetch(`${API_BASE}/api/rooms/${roomId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId
      })
    });

    if (!response.ok) {
      const error: APIError = await response.json();
      throw new Error(error.error || 'Failed to leave room');
    }

    return response.json();
  }
}