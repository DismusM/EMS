import { Router, Request, Response } from 'express';
import * as assetService from '../services/assetService';
import { authMiddleware, canManageAssets } from '../middleware/authMiddleware';

const router = Router();

// All asset routes require a valid token
router.use(authMiddleware);

// GET /api/assets - List all assets (accessible to all authenticated users)
router.get('/', async (req: Request, res: Response) => {
  try {
    const assets = await assetService.getAllAssets();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assets.' });
  }
});

// GET /api/assets/:id - Get a single asset (accessible to all authenticated users)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const asset = await assetService.getAssetById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found.' });
    }
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching asset.' });
  }
});

// The following routes for creating, updating, and deleting assets
// require specific permissions (Admin or Asset Manager).
router.use(canManageAssets);

// POST /api/assets - Create a new asset
router.post('/', async (req: Request, res: Response) => {
  try {
    const newAsset = await assetService.createAsset(req.body);
    res.status(201).json(newAsset);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ message: 'An asset with this serial number already exists.' });
    }
    res.status(500).json({ message: 'Error creating asset.' });
  }
});

// PUT /api/assets/:id - Update an existing asset
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedAsset = await assetService.updateAsset(req.params.id, req.body);
    if (!updatedAsset) {
      return res.status(404).json({ message: 'Asset not found.' });
    }
    res.json(updatedAsset);
  } catch (error) {
    res.status(500).json({ message: 'Error updating asset.' });
  }
});

// DELETE /api/assets/:id - Delete an asset
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await assetService.deleteAsset(req.params.id);
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: 'Error deleting asset.' });
  }
});

export default router;
