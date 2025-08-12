import { Request, Response, NextFunction } from 'express';

// In a real microservices architecture, this middleware would be more complex.
// It might call the User Management service to validate the token,
// or it would use a shared library with a public key to verify the JWT signature.
// For this code-only deliverable, we'll create a placeholder that checks for
// the presence of an Authorization header.

interface AuthenticatedRequest extends Request {
  user?: any;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is required.' });
  }

  // Placeholder for token verification. In a real scenario, you would verify the token here.
  // For now, we'll just simulate a decoded user object for the purpose of role checking.
  // This is NOT secure and is only for scaffolding purposes.
  const token = authHeader.split(' ')[1];
  if (token === 'admin-token') {
    req.user = { role: 'admin' };
  } else if (token === 'asset-manager-token') {
    req.user = { role: 'asset_manager' };
  } else {
    req.user = { role: 'client' }; // default for any other token
  }

  next();
}

// A middleware to check for roles that can manage assets
export function canManageAssets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const allowedRoles = ['admin', 'asset_manager'];
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: You do not have permission to manage assets.' });
  }
  next();
}
