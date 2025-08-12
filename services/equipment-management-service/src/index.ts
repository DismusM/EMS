import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import assetRoutes from './api/assetRoutes';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// Middleware to parse JSON bodies
app.use(express.json());

// A simple health check route
app.get('/health', (req: Request, res: Response) => {
  res.send('Equipment Management Service is running!');
});

// API Routes
app.use('/api/assets', assetRoutes);

// This is a placeholder for the server start, as we cannot run it.
function startServer() {
  console.log('--- Equipment Management Service Definition ---');
  console.log(`Would be running on port ${port}`);
  console.log('Routes configured:');
  console.log('  - /api/assets (for asset management)');
  console.log('-------------------------------------------');
}

// We call this function to simulate the server setup.
startServer();

// The actual listen call is commented out.
/*
app.listen(port, () => {
  console.log(`Equipment Management Service listening on port ${port}`);
});
*/
