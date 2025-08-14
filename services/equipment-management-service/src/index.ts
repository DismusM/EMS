import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import assetRoutes from './api/assetRoutes';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// CORS: allow frontend to send/receive cookies if needed
const WEB_ORIGIN = process.env.WEB_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: WEB_ORIGIN, credentials: true }));
// Middleware to parse JSON bodies
app.use(express.json());

// A simple health check route
app.get('/health', (req: Request, res: Response) => {
  res.send('Equipment Management Service is running!');
});

// API Routes
app.use('/api/assets', assetRoutes);

// Start the server
app.listen(port, () => {
  console.log(`🚀 Equipment Management Service listening on port ${port}`);
  console.log('Routes configured:');
  console.log('  - /api/assets (for asset management)');
});
