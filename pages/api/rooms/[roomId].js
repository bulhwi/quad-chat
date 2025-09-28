import { getRoomData, addUserToRoom, addMessageToRoom, removeUserFromRoom } from '../../../lib/redis';

export default async function handler(req, res) {
  const { roomId } = req.query;
  const { method } = req;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (method) {
      case 'GET':
        // Get room info and messages
        const roomData = await getRoomData(roomId);
        res.status(200).json(roomData);
        break;

      case 'POST':
        // Join room
        const { nickname, action } = req.body;

        if (action === 'join') {
          const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const result = await addUserToRoom(roomId, userId, nickname);

          if (!result.success) {
            res.status(400).json({ error: result.error });
            return;
          }

          res.status(200).json({
            success: true,
            userId,
            room: {
              users: result.room.users,
              userCount: result.room.users.length
            }
          });
        } else {
          res.status(400).json({ error: 'Invalid action' });
        }
        break;

      case 'PUT':
        // Send message
        const { message, userId } = req.body;

        if (!message || !userId) {
          res.status(400).json({ error: 'Message and userId are required' });
          return;
        }

        const messageResult = await addMessageToRoom(roomId, userId, message);

        if (!messageResult.success) {
          res.status(403).json({ error: messageResult.error });
          return;
        }

        res.status(200).json({
          success: true,
          message: messageResult.message
        });
        break;

      case 'DELETE':
        // Leave room
        const { userId: leavingUserId } = req.body;

        if (!leavingUserId) {
          res.status(400).json({ error: 'userId is required' });
          return;
        }

        await removeUserFromRoom(roomId, leavingUserId);
        res.status(200).json({ success: true });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}