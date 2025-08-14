import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './api/authRoutes';
import userRoutes from './api/userRoutes';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS: allow frontend to send/receive cookies
const WEB_ORIGIN = process.env.WEB_ORIGIN || 'http://localhost:3000';
app.use(cors({
  origin: WEB_ORIGIN,
  credentials: true,
}));
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// A simple health check route
app.get('/health', (req: Request, res: Response) => {
  res.send('User Management Service is running!');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`🚀 User Management Service listening on port ${port}`);
  console.log('Routes configured:');
  console.log('  - /api/auth (for login)');
  console.log('  - /api/users (for user management)');
});
