import { Redis } from '@upstash/redis';

// Redis 연결 설정
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 방 데이터 타입 정의
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

// Redis 키 생성 함수
export const getRoomKey = (roomId: string) => `room:${roomId}`;

// 방 데이터 가져오기
export async function getRoomData(roomId: string): Promise<RoomData> {
  const key = getRoomKey(roomId);
  const data = await redis.get<RoomData>(key);

  return data || { users: [], messages: [] };
}

// 방 데이터 저장하기
export async function setRoomData(roomId: string, data: RoomData): Promise<void> {
  const key = getRoomKey(roomId);
  // 24시간 후 자동 삭제 (TTL: 86400초)
  await redis.setex(key, 86400, data);
}

// 사용자 추가
export async function addUserToRoom(
  roomId: string,
  userId: string,
  nickname: string
): Promise<{ success: boolean; room?: RoomData; error?: string }> {
  const roomData = await getRoomData(roomId);

  // 4명 제한 확인
  if (roomData.users.length >= 4) {
    return { success: false, error: 'Room is full' };
  }

  // 이미 존재하는 사용자인지 확인
  const existingUser = roomData.users.find(u => u.id === userId);
  if (existingUser) {
    return { success: true, room: roomData };
  }

  // 새 사용자 추가
  const newUser = {
    id: userId,
    nickname: nickname || `User${Math.floor(Math.random() * 1000)}`,
    joinedAt: new Date().toISOString()
  };

  roomData.users.push(newUser);
  await setRoomData(roomId, roomData);

  return { success: true, room: roomData };
}

// 메시지 추가
export async function addMessageToRoom(
  roomId: string,
  userId: string,
  message: string
): Promise<{ success: boolean; message?: RoomData['messages'][0]; error?: string }> {
  const roomData = await getRoomData(roomId);

  // 사용자가 방에 있는지 확인
  const user = roomData.users.find(u => u.id === userId);
  if (!user) {
    return { success: false, error: 'User not in room' };
  }

  // 새 메시지 생성
  const messageData = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    nickname: user.nickname,
    message,
    timestamp: new Date().toISOString()
  };

  // 메시지 추가 (최대 100개 유지)
  roomData.messages.push(messageData);
  if (roomData.messages.length > 100) {
    roomData.messages.shift();
  }

  await setRoomData(roomId, roomData);

  return { success: true, message: messageData };
}

// 사용자 제거
export async function removeUserFromRoom(roomId: string, userId: string): Promise<void> {
  const roomData = await getRoomData(roomId);

  // 사용자 제거
  roomData.users = roomData.users.filter(u => u.id !== userId);

  // 방에 사용자가 없으면 방 삭제
  if (roomData.users.length === 0) {
    const key = getRoomKey(roomId);
    await redis.del(key);
  } else {
    await setRoomData(roomId, roomData);
  }
}