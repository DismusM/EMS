import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import authRoutes from './api/authRoutes';
import userRoutes from './api/userRoutes';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// A simple health check route
app.get('/health', (req: Request, res: Response) => {
  res.send('User Management Service is running!');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// This is a placeholder for the server start.
// In a real environment, we would call app.listen(port, ...)
// but since we cannot run the server, this file serves as a declaration
// of the server's structure.
function startServer() {
  console.log('--- User Management Service Definition ---');
  console.log(`Would be running on port ${port}`);
  console.log('Routes configured:');
  console.log('  - /api/auth (for login)');
  console.log('  - /api/users (for user management)');
  console.log('-----------------------------------------');
}

// We call this function to simulate the server setup in this code-only environment.
startServer();

// The actual listen call is commented out because we cannot run the server.
/*
app.listen(port, () => {
  console.log(`User Management Service listening on port ${port}`);
});
*/
