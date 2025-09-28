import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = () => {
  if (!socket) {
    // For production, use current domain with socket path
    // For development, use custom server
    const isDev = process.env.NODE_ENV === 'development';
    const serverUrl = isDev
      ? 'http://localhost:3001'
      : (typeof window !== 'undefined' ? window.location.origin : '');

    socket = io(serverUrl, {
      path: isDev ? '/socket.io/' : '/api/socket',
      autoConnect: false,
      transports: ['polling', 'websocket'],
      timeout: 20000,
      upgrade: true,
      rememberUpgrade: false
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