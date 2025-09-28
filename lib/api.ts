// API client for HTTP polling instead of Socket.io

export interface Room {
  users: Array<{
    id: string;
    nickname: string;
    joinedAt: string;
  }>;
  messages: Array<{
    id: string;
    userId: string;
    nickname: string;
    message: string;
    timestamp: string;
  }>;
}

export interface JoinRoomResponse {
  success: boolean;
  userId: string;
  room: {
    users: Room['users'];
    userCount: number;
  };
}

const API_BASE = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001'
  : '';

export class ChatAPI {
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
      const error = await response.json();
      throw new Error(error.error || 'Failed to join room');
    }

    return response.json();
  }

  static async getRoomData(roomId: string): Promise<Room> {
    const response = await fetch(`${API_BASE}/api/rooms/${roomId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to get room data');
    }

    return response.json();
  }

  static async sendMessage(roomId: string, userId: string, message: string) {
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
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    return response.json();
  }

  static async leaveRoom(roomId: string, userId: string) {
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
      throw new Error('Failed to leave room');
    }

    return response.json();
  }
}