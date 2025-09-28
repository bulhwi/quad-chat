// API for room management
const MAX_USERS_PER_ROOM = 4;

// In-memory storage (in production, use a database)
let rooms = new Map();

export default function handler(req, res) {
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

  switch (method) {
    case 'GET':
      // Get room info and messages
      const room = rooms.get(roomId) || { users: [], messages: [] };
      res.status(200).json(room);
      break;

    case 'POST':
      // Join room
      const { nickname, action } = req.body;

      if (action === 'join') {
        let room = rooms.get(roomId) || { users: [], messages: [] };

        if (room.users.length >= MAX_USERS_PER_ROOM) {
          res.status(400).json({ error: 'Room is full' });
          return;
        }

        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newUser = {
          id: userId,
          nickname: nickname || `User${Math.floor(Math.random() * 1000)}`,
          joinedAt: new Date()
        };

        room.users.push(newUser);
        rooms.set(roomId, room);

        res.status(200).json({
          success: true,
          userId,
          room: {
            users: room.users,
            userCount: room.users.length
          }
        });
      }
      break;

    case 'PUT':
      // Send message
      const { message, userId } = req.body;
      let targetRoom = rooms.get(roomId);

      if (!targetRoom) {
        res.status(404).json({ error: 'Room not found' });
        return;
      }

      const user = targetRoom.users.find(u => u.id === userId);
      if (!user) {
        res.status(403).json({ error: 'User not in room' });
        return;
      }

      const messageData = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        nickname: user.nickname,
        message,
        timestamp: new Date()
      };

      targetRoom.messages.push(messageData);
      if (targetRoom.messages.length > 100) {
        targetRoom.messages.shift();
      }

      rooms.set(roomId, targetRoom);
      res.status(200).json({ success: true, message: messageData });
      break;

    case 'DELETE':
      // Leave room
      const { userId: leavingUserId } = req.body;
      let roomToLeave = rooms.get(roomId);

      if (roomToLeave) {
        roomToLeave.users = roomToLeave.users.filter(u => u.id !== leavingUserId);

        if (roomToLeave.users.length === 0) {
          rooms.delete(roomId);
        } else {
          rooms.set(roomId, roomToLeave);
        }
      }

      res.status(200).json({ success: true });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}