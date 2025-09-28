import { Redis } from '@upstash/redis';

// 1. Redis 데이터베이스 연결 설정
// - Upstash Redis REST API를 사용하여 연결
// - 환경변수에서 URL과 TOKEN을 가져와서 인증
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,   // Redis 서버 URL
  token: process.env.UPSTASH_REDIS_REST_TOKEN!, // 인증 토큰
});

// 2. 채팅방 데이터 구조 정의
// - 각 방에는 사용자 목록과 메시지 목록이 저장됨
export interface RoomData {
  users: Array<{
    id: string;        // 사용자 고유 ID
    nickname: string;  // 사용자 닉네임
    joinedAt: string;  // 방 입장 시간
  }>;
  messages: Array<{
    id: string;        // 메시지 고유 ID
    userId: string;    // 메시지 작성자 ID
    nickname: string;  // 메시지 작성자 닉네임
    message: string;   // 메시지 내용
    timestamp: string; // 메시지 작성 시간
  }>;
}

// 3. Redis 키 생성 함수
// - 방 ID를 받아서 Redis 저장용 키를 생성 (예: "room:abc123")
export const getRoomKey = (roomId: string) => `room:${roomId}`;

// 4. 방 데이터 조회 함수
// - Redis에서 방 정보를 가져오는 함수
// - 방이 없으면 빈 데이터를 반환
export async function getRoomData(roomId: string): Promise<RoomData> {
  const key = getRoomKey(roomId);           // Redis 키 생성
  const data = await redis.get<RoomData>(key); // Redis에서 데이터 조회

  return data || { users: [], messages: [] }; // 데이터가 없으면 빈 방 반환
}

// 5. 방 데이터 저장 함수
// - 방 정보를 Redis에 저장하는 함수
// - 24시간 후 자동 삭제되도록 TTL 설정
export async function setRoomData(roomId: string, data: RoomData): Promise<void> {
  const key = getRoomKey(roomId);               // Redis 키 생성
  await redis.setex(key, 86400, data);         // 24시간(86400초) TTL로 저장
}

// 6. 사용자 방 입장 함수
// - 새로운 사용자를 채팅방에 추가하는 함수
// - 4명 제한, 중복 체크 등의 로직 포함
export async function addUserToRoom(
  roomId: string,
  userId: string,
  nickname: string
): Promise<{ success: boolean; room?: RoomData; error?: string }> {
  const roomData = await getRoomData(roomId); // 현재 방 데이터 조회

  // 6-1. 방 인원 제한 확인 (최대 4명)
  if (roomData.users.length >= 4) {
    return { success: false, error: 'Room is full' };
  }

  // 6-2. 이미 방에 있는 사용자인지 확인
  const existingUser = roomData.users.find(u => u.id === userId);
  if (existingUser) {
    return { success: true, room: roomData }; // 이미 있으면 현재 방 정보 반환
  }

  // 6-3. 새 사용자 정보 생성
  const newUser = {
    id: userId,
    nickname: nickname || `User${Math.floor(Math.random() * 1000)}`, // 닉네임이 없으면 랜덤 생성
    joinedAt: new Date().toISOString() // 현재 시간을 ISO 문자열로 저장
  };

  // 6-4. 사용자를 방에 추가하고 Redis에 저장
  roomData.users.push(newUser);
  await setRoomData(roomId, roomData);

  return { success: true, room: roomData };
}

// 7. 메시지 전송 함수
// - 사용자가 보낸 메시지를 방에 추가하는 함수
// - 사용자 권한 확인 및 메시지 개수 제한 포함
export async function addMessageToRoom(
  roomId: string,
  userId: string,
  message: string
): Promise<{ success: boolean; message?: RoomData['messages'][0]; error?: string }> {
  const roomData = await getRoomData(roomId); // 현재 방 데이터 조회

  // 7-1. 메시지를 보내는 사용자가 방에 있는지 확인
  const user = roomData.users.find(u => u.id === userId);
  if (!user) {
    return { success: false, error: 'User not in room' };
  }

  // 7-2. 새 메시지 데이터 생성
  const messageData = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // 고유 ID 생성
    userId,                     // 메시지 작성자 ID
    nickname: user.nickname,    // 작성자 닉네임 (방에서 조회)
    message,                    // 메시지 내용
    timestamp: new Date().toISOString() // 현재 시간
  };

  // 7-3. 메시지를 방에 추가 (최대 100개까지만 유지)
  roomData.messages.push(messageData);
  if (roomData.messages.length > 100) {
    roomData.messages.shift(); // 가장 오래된 메시지 삭제
  }

  // 7-4. 업데이트된 방 데이터를 Redis에 저장
  await setRoomData(roomId, roomData);

  return { success: true, message: messageData };
}

// 8. 사용자 방 퇴장 함수
// - 사용자를 방에서 제거하는 함수
// - 마지막 사용자가 나가면 방을 완전히 삭제
export async function removeUserFromRoom(roomId: string, userId: string): Promise<void> {
  const roomData = await getRoomData(roomId); // 현재 방 데이터 조회

  // 8-1. 사용자를 방에서 제거
  roomData.users = roomData.users.filter(u => u.id !== userId);

  // 8-2. 방에 사용자가 없으면 방을 완전히 삭제
  if (roomData.users.length === 0) {
    const key = getRoomKey(roomId);
    await redis.del(key); // Redis에서 방 데이터 삭제
  } else {
    // 8-3. 아직 사용자가 있으면 업데이트된 데이터 저장
    await setRoomData(roomId, roomData);
  }
}