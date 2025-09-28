import { Server } from 'socket.io';

const MAX_USERS_PER_ROOM = 4;
const rooms = new Map();

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket.io already initialized');
  } else {
    console.log('Initializing Socket.io server...');

    const io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      socket.on('join-room', ({ roomId, nickname }) => {
        console.log(`User ${nickname} trying to join room ${roomId}`);

        const room = rooms.get(roomId) || { users: new Map(), messages: [] };

        if (room.users.size >= MAX_USERS_PER_ROOM) {
          socket.emit('room-full');
          return;
        }

        socket.join(roomId);
        room.users.set(socket.id, {
          id: socket.id,
          nickname: nickname || `User${Math.floor(Math.random() * 1000)}`,
          joinedAt: new Date()
        });
        rooms.set(roomId, room);

        socket.roomId = roomId;
        socket.nickname = room.users.get(socket.id).nickname;

        io.to(roomId).emit('user-joined', {
          userId: socket.id,
          nickname: socket.nickname,
          userCount: room.users.size,
          users: Array.from(room.users.values())
        });

        socket.emit('previous-messages', room.messages);

        console.log(`User ${socket.nickname} joined room ${roomId}. Users in room: ${room.users.size}`);
      });

      socket.on('send-message', ({ message, roomId }) => {
        const room = rooms.get(roomId);
        if (!room || !room.users.has(socket.id)) return;

        const messageData = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId: socket.id,
          nickname: socket.nickname,
          message,
          timestamp: new Date()
        };

        room.messages.push(messageData);
        if (room.messages.length > 100) {
          room.messages.shift();
        }

        io.to(roomId).emit('receive-message', messageData);
      });

      socket.on('disconnect', () => {
        if (socket.roomId) {
          const room = rooms.get(socket.roomId);
          if (room) {
            room.users.delete(socket.id);

            if (room.users.size === 0) {
              rooms.delete(socket.roomId);
            } else {
              io.to(socket.roomId).emit('user-left', {
                userId: socket.id,
                nickname: socket.nickname,
                userCount: room.users.size,
                users: Array.from(room.users.values())
              });
            }
          }
        }
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  res.end();
}