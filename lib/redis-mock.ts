// 메모리 기반 임시 저장소 (테스트용)
const memoryStore = new Map<string, any>();

export const redis = {
  async get<T>(key: string): Promise<T | null> {
    return memoryStore.get(key) || null;
  },

  async setex(key: string, ttl: number, value: any): Promise<void> {
    memoryStore.set(key, value);
    // TTL은 테스트용이므로 무시
  },

  async del(key: string): Promise<void> {
    memoryStore.delete(key);
  }
};

// 2. 채팅방 데이터 구조 정의
export interface RoomData {
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

// 3. Redis 키 생성 함수
export const getRoomKey = (roomId: string) => `room:${roomId}`;

// 4. 방 데이터 조회 함수
export async function getRoomData(roomId: string): Promise<RoomData> {
  const key = getRoomKey(roomId);
  const data = await redis.get<RoomData>(key);
  return data || { users: [], messages: [] };
}

// 5. 방 데이터 저장 함수
export async function setRoomData(roomId: string, data: RoomData): Promise<void> {
  const key = getRoomKey(roomId);
  await redis.setex(key, 86400, data);
}

// 6. 사용자 방 입장 함수
export async function addUserToRoom(
  roomId: string,
  userId: string,
  nickname: string
): Promise<{ success: boolean; room?: RoomData; error?: string }> {
  const roomData = await getRoomData(roomId);

  if (roomData.users.length >= 4) {
    return { success: false, error: '방이 가득 찼습니다. (최대 4명)' };
  }

  const existingUser = roomData.users.find(u => u.id === userId);
  if (existingUser) {
    return { success: true, room: roomData };
  }

  const newUser = {
    id: userId,
    nickname: nickname || `User${Math.floor(Math.random() * 1000)}`,
    joinedAt: new Date().toISOString()
  };

  roomData.users.push(newUser);
  await setRoomData(roomId, roomData);

  return { success: true, room: roomData };
}

// 7. 메시지 전송 함수
export async function addMessageToRoom(
  roomId: string,
  userId: string,
  message: string
): Promise<{ success: boolean; message?: RoomData['messages'][0]; error?: string }> {
  const roomData = await getRoomData(roomId);

  const user = roomData.users.find(u => u.id === userId);
  if (!user) {
    return { success: false, error: '방에 참여하지 않은 사용자입니다.' };
  }

  const messageData = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    nickname: user.nickname,
    message,
    timestamp: new Date().toISOString()
  };

  roomData.messages.push(messageData);
  if (roomData.messages.length > 100) {
    roomData.messages.shift();
  }

  await setRoomData(roomId, roomData);

  return { success: true, message: messageData };
}

// 8. 사용자 방 퇴장 함수
export async function removeUserFromRoom(roomId: string, userId: string): Promise<void> {
  const roomData = await getRoomData(roomId);

  roomData.users = roomData.users.filter(u => u.id !== userId);

  if (roomData.users.length === 0) {
    const key = getRoomKey(roomId);
    await redis.del(key);
  } else {
    await setRoomData(roomId, roomData);
  }
}