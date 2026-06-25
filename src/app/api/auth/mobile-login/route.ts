import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'montajimvar-gizli-anahtar-degistirin';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'montajimvar-refresh-secret';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre gerekli' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Bu e-posta ile kayıtlı kullanıcı bulunamadı' },
        { status: 401 }
      );
    }

    // Verify password
    const bcrypt = require('bcryptjs');
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Hatalı şifre' },
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: 'E-posta adresiniz doğrulanmamış. Lütfen e-postanızı kontrol edin.' },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        roles: user.roles 
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token in database (optional, for revocation)
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        // You could store refresh token hash here for revocation
      },
    });

    return NextResponse.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        roles: user.roles,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Mobile login error:', error);
    return NextResponse.json(
      { error: 'Giriş sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}