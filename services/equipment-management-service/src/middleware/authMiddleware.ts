import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is required.' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'dev-secret';
  if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET is not defined. Using development default.');
  }

  if (!secret) {
    console.error('JWT_SECRET is not defined.');
    return res.status(500).json({ message: 'Server configuration error.' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // contains { sub, email, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

export function canManageAssets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const allowedRoles = ['admin', 'asset_manager'];
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: You do not have permission to manage assets.' });
  }
  next();
}
