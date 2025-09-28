import { NextRequest, NextResponse } from 'next/server';
import { getRoomData, addUserToRoom, addMessageToRoom, removeUserFromRoom } from '@/lib/redis';

interface RouteParams {
  params: Promise<{ roomId: string }>;
}

// 방 정보 조회
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { roomId } = await params;
    const roomData = await getRoomData(roomId);
    return NextResponse.json(roomData);
  } catch (error) {
    console.error('방 정보 조회 오류:', error);
    return NextResponse.json(
      { error: '방 정보를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 방 입장
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { roomId } = await params;
    const { nickname, action, userId } = await request.json();

    if (action === 'join') {
      if (!nickname || nickname.trim() === '') {
        return NextResponse.json(
          { error: '닉네임을 입력해주세요.' },
          { status: 400 }
        );
      }

      // 고유한 사용자 ID 생성
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Redis에 사용자 추가 시도
      const result = await addUserToRoom(roomId, userId, nickname.trim());

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        userId,
        room: {
          users: result.room?.users || [],
          userCount: result.room?.users?.length || 0
        }
      });
    } else if (action === 'leave') {
      if (!userId) {
        return NextResponse.json(
          { error: 'userId is required' },
          { status: 400 }
        );
      }

      // Redis에서 사용자 제거
      await removeUserFromRoom(roomId, userId);

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('방 입장 오류:', error);
    return NextResponse.json(
      { error: '방 입장에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 메시지 전송
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { roomId } = await params;
    const { message, userId } = await request.json();

    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Message and userId are required' },
        { status: 400 }
      );
    }

    // Redis에 메시지 추가 시도
    const messageResult = await addMessageToRoom(roomId, userId, message);

    if (!messageResult.success) {
      return NextResponse.json(
        { error: messageResult.error },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: messageResult.message
    });
  } catch (error) {
    console.error('메시지 전송 오류:', error);
    return NextResponse.json(
      { error: '메시지 전송에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 방 퇴장
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { roomId } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Redis에서 사용자 제거
    await removeUserFromRoom(roomId, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('방 퇴장 오류:', error);
    return NextResponse.json(
      { error: '방 퇴장에 실패했습니다.' },
      { status: 500 }
    );
  }
}