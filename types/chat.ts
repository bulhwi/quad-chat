export interface User {
  id: string;
  nickname: string;
  joinedAt: Date;
}

export interface Message {
  id: string;
  userId: string;
  nickname: string;
  message: string;
  timestamp: Date;
}

export interface Room {
  id: string;
  users: User[];
  userCount: number;
}