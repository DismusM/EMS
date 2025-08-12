import { Router, Request, Response } from 'express';
import { validateUser, generateToken } from '../services/authService';

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

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    // In a real app, setting the token in an HttpOnly cookie is more secure.
    res.json({ message: 'Login successful', token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});

export default router;
