import { findUserByEmail } from './userService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function validateUser(email: string, password_raw: string) {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password_raw, user.passwordHash);

  if (!isPasswordValid) {
    return null;
  }

  return user;
}

export function generateToken(user: { id: string; email: string; role: { id: string } }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // In a real app, you'd want a more robust error handling and logging mechanism.
    throw new Error('JWT_SECRET is not defined in the environment.');
  }

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role.id,
  };

  const token = jwt.sign(payload, secret, { expiresIn: '1d' }); // Token expires in 1 day
  return token;
}
