import { NextRequest } from 'next/server';
import { Server as NetServer } from 'http';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponseServerIO } from '@/types/socket';

export const dynamic = 'force-dynamic';

const MAX_USERS_PER_ROOM = 4;
const rooms = new Map();

export async function GET(req: NextRequest) {
  const res = new Response('Socket.io server is running', { status: 200 });

  return res;
}