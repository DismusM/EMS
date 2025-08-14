import { Router, Request, Response } from 'express';
import { validateUser, generateToken, createRefreshToken, verifyRefreshToken, deleteRefreshToken } from '../services/authService';
import { registerUser } from '../services/userService';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await validateUser(email, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // The user object from validateUser includes the role object.
    // We need to ensure the role object is present before generating the token.
    if (!user.role) {
        return res.status(500).json({ message: 'User role not found.' });
    }

    const accessToken = generateToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = await createRefreshToken(user.id);

    const isProd = process.env.NODE_ENV === 'production';
    // In dev: secure=false and SameSite=Lax so cookies work across localhost:3000 -> 3001
    // In prod: secure=true and SameSite=None for cross-site requests from the web app domain
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: (isProd ? 'none' : 'lax'),
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

        const { passwordHash, ...userProfile } = user;
    res.json({ message: 'Login successful', accessToken, user: userProfile });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});


router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    const newUser = await registerUser({ name, email, password });
    const { passwordHash, ...userProfile } = newUser!;
    res.status(201).json(userProfile);
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ message: 'A user with this email already exists.' });
    }
    res.status(500).json({ message: 'An error occurred during registration.' });
  }
});

// POST /auth/refresh - Refresh the access token
router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found' });
  }

  try {
    const user = await verifyRefreshToken(refreshToken);
    // The user object from verifyRefreshToken includes the role.
    const accessToken = generateToken({ id: user.id, email: user.email, role: user.role! });
    res.json({ accessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    // Clear the cookie if the refresh token is invalid (mirror attributes)
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0), secure: isProd, sameSite: (isProd ? 'none' : 'lax'), path: '/' });
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
});

// POST /auth/logout - Logout the user
router.post('/logout', async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    try {
        await deleteRefreshToken(refreshToken);
    } catch (error) {
        console.error('Error deleting refresh token:', error);
    }
  }

  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0), secure: isProd, sameSite: (isProd ? 'none' : 'lax'), path: '/' });
  res.status(200).json({ message: 'Logout successful' });
});

export default router;
