import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = () => {
  if (!socket) {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ||
      (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

    socket = io(serverUrl, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};