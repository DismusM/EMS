import { Router, Request, Response } from 'express';
import { createUser, getAllUsers, findUserById } from '../services/userService';
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

// Admin-only routes
router.use(adminOnly);

// GET /api/users - Get all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    // Omit password hashes
    const userProfiles = users.map(({ passwordHash, ...rest }) => rest);
    res.json(userProfiles);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'An error occurred fetching users.' });
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
    if (error.message.includes('UNIQUE constraint failed: users.email')) {
        return res.status(409).json({ message: 'A user with this email already exists.' });
    }
    res.status(500).json({ message: 'An error occurred while creating the user.' });
  }
});

export default router;
