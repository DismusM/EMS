import { db } from '../db';
import { users, roles, userActivity } from '../db/schema';
import { and, eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function logUserActivity(actorUserId: string | null, userId: string, action: string, before?: any, after?: any) {
  await db.insert(userActivity).values({
    id: crypto.randomUUID(),
    userId,
    actorUserId: actorUserId || null,
    action,
    beforeJson: before ? JSON.stringify(before) : null,
    afterJson: after ? JSON.stringify(after) : null,
  });
}

export async function findUserByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: and(eq(users.email, email), eq(users.isDeleted, 0 as any)),
    with: {
      role: true,
    },
  });
  return user;
}

export async function deleteUser(userId: string, actorUserId: string) {
  const before = await findUserById(userId);
  await db.update(users)
    .set({ isDeleted: 1 as any, deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(users.id, userId));
  await logUserActivity(actorUserId, userId, 'DELETED', before, null);
}

export async function findUserById(id: string) {
  const user = await db.query.users.findFirst({
    where: and(eq(users.id, id), eq(users.isDeleted, 0 as any)),
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
  const created = await findUserById(newUser.id);
  await logUserActivity(newUser.id, newUser.id, 'CREATED', null, created);
  return created;
}

export async function registerUser(userData: { name: string; email: string; password: string }) {
  const passwordHash = await bcrypt.hash(userData.password, 10);

  const newUser = {
    id: crypto.randomUUID(),
    name: userData.name,
    email: userData.email,
    passwordHash,
    roleId: 'client', // Default role for new signups
    status: 'pending' as const, // New users are pending approval
  };

  await db.insert(users).values(newUser);
  return findUserById(newUser.id);
}

export async function getAllUsers(status?: 'pending' | 'approved' | 'rejected', roleId?: string, q?: string) {
  const rows = await db.query.users.findMany({
    where: status ? and(eq(users.status, status), eq(users.isDeleted, 0 as any)) : eq(users.isDeleted, 0 as any),
    with: {
      role: true,
    }
  });
  let filtered = rows;
  if (roleId) {
    filtered = filtered.filter(u => u.roleId === roleId);
  }
  if (q && q.trim().length > 0) {
    const needle = q.trim().toLowerCase();
    filtered = filtered.filter(u =>
      u.name.toLowerCase().includes(needle) ||
      u.email.toLowerCase().includes(needle)
    );
  }
  return filtered;
}

export async function updateUserStatus(userId: string, status: 'approved' | 'rejected', roleId?: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  // if approving and roleId provided, validate
  if (status === 'approved' && roleId) {
    const role = await db.query.roles.findFirst({ where: eq(roles.id, roleId) });
    if (!role) throw new Error('Role not found');
  }

  await db.update(users)
    .set({ 
      status, 
      statusChangedAt: new Date(),
      updatedAt: new Date(),
      ...(status === 'approved' && roleId ? { roleId } : {} as any),
    })
    .where(eq(users.id, userId));
  const updated = await findUserById(userId);
  await logUserActivity(userId, userId, 'STATUS_CHANGED', user, updated);
  return updated;
}

export async function updateUserRole(userId: string, roleId: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const role = await db.query.roles.findFirst({ where: eq(roles.id, roleId) });
  if (!role) {
    throw new Error('Role not found');
  }

  await db.update(users)
    .set({ roleId, updatedAt: new Date() })
    .where(eq(users.id, userId));
  const updated = await findUserById(userId);
  await logUserActivity(userId, userId, 'ROLE_CHANGED', user, updated);
  return updated;
}

export async function updateUserProfile(userId: string, data: { name?: string; email?: string; password?: string; oldPassword?: string }) {
  const user = await findUserById(userId);
  if (!user) throw new Error('User not found');
  const patch: any = { updatedAt: new Date() };
  if (data.name) patch.name = data.name;
  if (data.email) patch.email = data.email;
  if (data.password) {
    if (!data.oldPassword) {
      throw new Error('Old password is required to set a new password');
    }
    const ok = await bcrypt.compare(data.oldPassword, user.passwordHash);
    if (!ok) {
      throw new Error('Old password is incorrect');
    }
    patch.passwordHash = await bcrypt.hash(data.password, 10);
  }
  await db.update(users).set(patch).where(eq(users.id, userId));
  const updated = await findUserById(userId);
  await logUserActivity(userId, userId, 'UPDATED', user, updated);
  return updated;
}

export async function getUserActivity(userId: string) {
  const rows = await db.select().from(userActivity).where(eq(userActivity.userId, userId)).orderBy(userActivity.createdAt as any);
  return rows;
}
