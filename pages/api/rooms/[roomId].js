// 1. Redis 함수들 가져오기
// - 방 데이터 조회, 사용자 추가, 메시지 추가, 사용자 제거 함수
import { getRoomData, addUserToRoom, addMessageToRoom, removeUserFromRoom } from '../../../lib/redis';

// 2. API 라우트 핸들러 함수
// - 클라이언트에서 오는 HTTP 요청을 처리하는 메인 함수
// - GET, POST, PUT, DELETE 메서드를 지원
export default async function handler(req, res) {
  const { roomId } = req.query;  // URL에서 방 ID 추출
  const { method } = req;        // HTTP 메서드 확인

  // 3. CORS 설정 (모든 도메인에서 접근 허용)
  // - 브라우저에서 다른 도메인 API 호출 시 필요
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 4. OPTIONS 요청 처리 (CORS 프리플라이트)
  // - 브라우저가 실제 요청 전에 보내는 확인 요청
  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 5. HTTP 메서드별 처리 로직
  try {
    switch (method) {
      case 'GET':
        // 5-1. 방 정보 조회 (GET /api/rooms/[roomId])
        // - 방의 사용자 목록과 메시지 목록을 가져옴
        // - 클라이언트가 주기적으로 호출하여 실시간 업데이트
        const roomData = await getRoomData(roomId);
        res.status(200).json(roomData);
        break;

      case 'POST':
        // 5-2. 방 입장 처리 (POST /api/rooms/[roomId])
        // - 새로운 사용자가 방에 참여할 때 사용
        const { nickname, action } = req.body;

        if (action === 'join') {
          // 5-2-1. 고유한 사용자 ID 생성
          const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

          // 5-2-2. Redis에 사용자 추가 시도
          const result = await addUserToRoom(roomId, userId, nickname);

          // 5-2-3. 실패 시 에러 응답
          if (!result.success) {
            res.status(400).json({ error: result.error });
            return;
          }

          // 5-2-4. 성공 시 사용자 ID와 방 정보 응답
          res.status(200).json({
            success: true,
            userId,                                    // 생성된 사용자 ID
            room: {
              users: result.room.users,                // 현재 방의 사용자 목록
              userCount: result.room.users.length     // 현재 방의 사용자 수
            }
          });
        } else {
          res.status(400).json({ error: 'Invalid action' });
        }
        break;

      case 'PUT':
        // 5-3. 메시지 전송 처리 (PUT /api/rooms/[roomId])
        // - 사용자가 채팅 메시지를 보낼 때 사용
        const { message, userId } = req.body;

        // 5-3-1. 필수 파라미터 검증
        if (!message || !userId) {
          res.status(400).json({ error: 'Message and userId are required' });
          return;
        }

        // 5-3-2. Redis에 메시지 추가 시도
        const messageResult = await addMessageToRoom(roomId, userId, message);

        // 5-3-3. 실패 시 에러 응답 (사용자가 방에 없는 경우)
        if (!messageResult.success) {
          res.status(403).json({ error: messageResult.error });
          return;
        }

        // 5-3-4. 성공 시 새로 추가된 메시지 정보 응답
        res.status(200).json({
          success: true,
          message: messageResult.message // 타임스탬프, ID 등이 포함된 메시지 객체
        });
        break;

      case 'DELETE':
        // 5-4. 방 퇴장 처리 (DELETE /api/rooms/[roomId])
        // - 사용자가 방을 나갈 때 사용
        const { userId: leavingUserId } = req.body;

        // 5-4-1. 필수 파라미터 검증
        if (!leavingUserId) {
          res.status(400).json({ error: 'userId is required' });
          return;
        }

        // 5-4-2. Redis에서 사용자 제거
        await removeUserFromRoom(roomId, leavingUserId);

        // 5-4-3. 성공 응답
        res.status(200).json({ success: true });
        break;

      default:
        // 5-5. 지원하지 않는 HTTP 메서드 처리
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    // 6. 에러 처리
    // - 예상치 못한 서버 에러 발생 시 클라이언트에 응답
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined // 개발 환경에서만 상세 에러 표시
    });
  }
}