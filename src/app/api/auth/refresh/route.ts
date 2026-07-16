import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token gerekli' },
        { status: 400 }
      );
    }

    // Verify refresh token
    let decoded: { id: number } | null = null;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_SECRET!) as { id: number };
    } catch {
      return NextResponse.json(
        { error: 'Geçersiz veya süresi dolmuş refresh token' },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 401 }
      );
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        roles: user.roles 
      },
      JWT_SECRET!,
      { expiresIn: '15m' }
    );

    // Optionally generate new refresh token (rotation)
    const newRefreshToken = jwt.sign(
      { id: user.id },
      REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Token yenileme hatası' },
      { status: 500 }
    );
  }
}