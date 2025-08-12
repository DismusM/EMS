import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function findUserByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      role: true,
    },
  });
  return user;
}

export async function findUserById(id: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      role: true,
    },
  });
  return user;
}

export async function createUser(userData: { name: string; email: string; password: string; roleId: string }) {
  const passwordHash = await bcrypt.hash(userData.password, 10);

  const newUser = {
    id: crypto.randomUUID(),
    name: userData.name,
    email: userData.email,
    passwordHash,
    roleId: userData.roleId,
  };

  await db.insert(users).values(newUser);
  return findUserById(newUser.id);
}

export async function getAllUsers() {
    return db.query.users.findMany({
        with: {
            role: true,
        }
    });
}
