import { Router, Request, Response } from 'express';

interface UserWithPassword {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  roleId: string;
  status: 'pending' | 'approved' | 'rejected';
  statusChangedAt: Date | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  role?: {
    id: string;
    name: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
  };
  [key: string]: unknown; // For any additional properties
}
import { createUser, getAllUsers, findUserById, updateUserStatus, updateUserRole, deleteUser, updateUserProfile, getUserActivity } from '../controllers/userService';
import { authMiddleware, adminOnly } from '../middleware/authMiddleware';

const router = Router();

// All routes in this file are protected by the auth middleware
router.use(authMiddleware);

// GET /api/users/me - Get current user's profile
router.get('/me', async (req: Request, res: Response) => {
  // The user ID is attached to the request by the authMiddleware
  const userId = (req as any).user.sub;
  try {
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // Omit password hash before sending user data
    const { passwordHash, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'An error occurred fetching user profile.' });
  }
});

// PATCH /api/users/me - Update current user's profile (name/email/password)
router.patch('/me', async (req: Request, res: Response) => {
  const userId = (req as any).user.sub;
  const { name, email, password } = req.body as { name?: string; email?: string; password?: string };
  try {
    const before = await findUserById(userId);
    if (!before) return res.status(404).json({ message: 'User not found.' });
    const updated = await updateUserProfile(userId, { name, email, password });
    const { passwordHash, ...userProfile } = updated!;
    res.json(userProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'An error occurred updating profile.' });
  }
});

// Admin-only routes
router.use(adminOnly);

// GET /api/users/:id/activity - Retrieve user activity logs (admin only)
router.get('/:id/activity', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const rows = await getUserActivity(id);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ message: 'An error occurred fetching user activity.' });
  }
});

// DELETE /api/users/:id - Delete a user (temporary hard delete; TODO: soft delete with audit)
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  // Prevent self-management
  const actingUserId = (req as any).user.sub;
  if (actingUserId === id) {
    return res.status(403).json({ message: 'Admins cannot manage their own account.' });
  }
  try {
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await deleteUser(id, actingUserId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'An error occurred while deleting the user.' });
  }
});

// GET /api/users - Get all users
router.get('/', async (req: Request, res: Response) => {
  const status = req.query.status as 'pending' | 'approved' | 'rejected' | undefined;
  const role = req.query.role as string | undefined;
  const q = req.query.q as string | undefined;
  try {
    const users = (await getAllUsers(status, role, q)) as unknown as UserWithPassword[];
    // Omit password hashes
    const userProfiles = users.map(({ passwordHash, ...rest }: UserWithPassword) => rest);
    res.json(userProfiles);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'An error occurred fetching users.' });
  }
});

// PATCH /api/users/:id/status - Update user status (approve/reject)
router.patch('/:id/status', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, roleId } = req.body as { status?: 'approved' | 'rejected'; roleId?: string };

  // Prevent self-management
  const actingUserId = (req as any).user.sub;
  if (actingUserId === id) {
    return res.status(403).json({ message: 'Admins cannot manage their own account.' });
  }

  if (!status || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided. Must be "approved" or "rejected".' });
  }

  try {
    const updatedUser = await updateUserStatus(id, status as 'approved' | 'rejected', roleId);
    const { passwordHash, ...userProfile } = updatedUser!;
    res.json(userProfile);
  } catch (error) {
    console.error(`Error updating status for user ${id}:`, error);
    if (error instanceof Error && (error.message === 'User not found' || error.message === 'Role not found')) {
        return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'An error occurred while updating user status.' });
  }
});

// PATCH /api/users/:id/role - Update user role
router.patch('/:id/role', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { roleId } = req.body as { roleId?: string };

  // Prevent self-management
  const actingUserId = (req as any).user.sub;
  if (actingUserId === id) {
    return res.status(403).json({ message: 'Admins cannot manage their own account.' });
  }

  if (!roleId) {
    return res.status(400).json({ message: 'Missing required field: roleId.' });
  }

  try {
    const updated = await updateUserRole(id, roleId);
    const { passwordHash, ...userProfile } = updated!;
    res.json(userProfile);
  } catch (error) {
    console.error(`Error updating role for user ${id}:`, error);
    if (error instanceof Error && (error.message === 'User not found' || error.message === 'Role not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'An error occurred while updating user role.' });
  }
});

// PATCH /api/users/:id/active - Toggle active status (true => approved, false => pending)
router.patch('/:id/active', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { active } = req.body as { active?: boolean };
  // Prevent self-management
  const actingUserId = (req as any).user.sub;
  if (actingUserId === id) {
    return res.status(403).json({ message: 'Admins cannot manage their own account.' });
  }
  if (typeof active !== 'boolean') {
    return res.status(400).json({ message: 'Missing or invalid field: active (boolean).' });
  }
  const status: 'approved' | 'rejected' | 'pending' = active ? 'approved' : 'pending';
  try {
    const updated = await updateUserStatus(id, status as 'approved' | 'rejected');
    const { passwordHash, ...userProfile } = updated!;
    res.json(userProfile);
  } catch (error) {
    console.error(`Error toggling active for user ${id}:`, error);
    if (error instanceof Error && error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'An error occurred while updating user status.' });
  }
});

// POST /api/users - Create a new user
router.post('/', async (req: Request, res: Response) => {
  const { name, email, password, roleId } = req.body;

  if (!name || !email || !password || !roleId) {
    return res.status(400).json({ message: 'Missing required fields: name, email, password, roleId.' });
  }

  try {
    const newUser = await createUser({ name, email, password, roleId });
    const { passwordHash, ...userProfile } = newUser!;
    res.status(201).json(userProfile);
  } catch (error) {
    console.error('Error creating user:', error);
    // Add a check for unique constraint violation
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed: users.email')) {
        return res.status(409).json({ message: 'A user with this email already exists.' });
    }
    res.status(500).json({ message: 'An error occurred while creating the user.' });
  }
});

export default router;
