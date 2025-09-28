import { NextRequest, NextResponse } from 'next/server';

// 방 생성 API
export async function POST(request: NextRequest) {
  try {
    const { nickname } = await request.json();

    if (!nickname || nickname.trim() === '') {
      return NextResponse.json(
        { error: '닉네임을 입력해주세요.' },
        { status: 400 }
      );
    }

    // 고유한 방 ID 생성 (6자리 랜덤 코드)
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    return NextResponse.json({
      success: true,
      roomId,
      nickname: nickname.trim()
    });
  } catch (error) {
    console.error('방 생성 오류:', error);
    return NextResponse.json(
      { error: '방 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}