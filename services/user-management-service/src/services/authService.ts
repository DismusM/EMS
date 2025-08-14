import { and, eq, gt } from 'drizzle-orm';
import { db } from '../db';
import { refreshTokens } from '../db/schema';
import { findUserByEmail } from './userService';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export async function validateUser(email: string, password_raw: string) {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password_raw, user.passwordHash);

  if (!isPasswordValid) {
    return null;
  }

  // Only allow approved users to login
  if ((user as any).status !== 'approved') {
    return null;
  }

  return user;
}

export function generateToken(user: { id: string; email: string; role: { id: string, name: string } | string }) {
  const secret = process.env.JWT_SECRET || 'dev-secret';
  if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET is not defined. Using development default.');
  }

  const roleId = typeof user.role === 'string' ? user.role : user.role.id;
  const payload = {
    sub: user.id,
    email: user.email,
    role: roleId,
  };

  const expiresInEnv = process.env.ACCESS_TOKEN_TTL || '1h';
  const jwtSecret: Secret = secret as Secret;
  const signOptions: SignOptions = { expiresIn: expiresInEnv as unknown as SignOptions['expiresIn'] };
  const token = jwt.sign(payload, jwtSecret, signOptions);
  return token;
}

export async function createRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date();
  const days = parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || '7', 10);
  expiresAt.setDate(expiresAt.getDate() + days);

  await db.insert(refreshTokens).values({
    userId,
    token,
    expiresAt,
  });

  return token;
}

export async function verifyRefreshToken(token: string) {
  const storedToken = await db.query.refreshTokens.findFirst({
    where: and(
      eq(refreshTokens.token, token),
      gt(refreshTokens.expiresAt, new Date())
    ),
    with: {
      user: {
        with: {
          role: true,
        }
      }
    },
  });

  if (!storedToken || !storedToken.user) {
    throw new Error('Invalid or expired refresh token');
  }

  const user: any = storedToken.user;
  // Block soft-deleted or non-approved users from refreshing
  if (user.isDeleted || user.status !== 'approved') {
    throw new Error('User not allowed');
  }
  return user;
}

export async function deleteRefreshToken(token: string) {
  await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
}
