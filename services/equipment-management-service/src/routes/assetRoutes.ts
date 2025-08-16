import { Router, Request, Response } from 'express';
import * as assetService from '../controllers/assetService';
import { authMiddleware, canManageAssets } from '../middleware/authMiddleware';

const router = Router();

// All asset routes require a valid token
router.use(authMiddleware);

// GET /api/assets - List all assets (accessible to all authenticated users)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, q, location, department, custodianName } = req.query as any;
    const assets = await assetService.getAllAssets({ status, q, location, department, custodianName });
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
    const body = req.body || {};
    // Simple validation and normalization
    const allowedStatuses = new Set(['OPERATIONAL', 'IN_REPAIR', 'DECOMMISSIONED']);
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const serialNumber = typeof body.serialNumber === 'string' ? body.serialNumber.trim() : '';
    const status = typeof body.status === 'string' ? body.status.trim() : '';
    if (!name || !serialNumber || !allowedStatuses.has(status)) {
      return res.status(400).json({ message: 'Invalid payload. Require name, serialNumber, and valid status.' });
    }
    const model = typeof body.model === 'string' ? body.model.trim() : undefined;
    const location = typeof body.location === 'string' ? body.location.trim() : undefined;
    const department = typeof body.department === 'string' ? body.department.trim() : undefined;
    const building = typeof body.building === 'string' ? body.building.trim() : undefined;
    const room = typeof body.room === 'string' ? body.room.trim() : undefined;
    const custodianId = typeof body.custodianId === 'string' ? body.custodianId.trim() : undefined;
    const custodianName = typeof body.custodianName === 'string' ? body.custodianName.trim() : undefined;
    const purchaseDate = body.purchaseDate ? new Date(body.purchaseDate) : undefined;
    const actorUserId = (req as any).user?.id as string | undefined;
    const payload = { name, serialNumber, status, model, location, purchaseDate, department, building, room, custodianId, custodianName, actorUserId };
    const newAsset = await assetService.createAsset(payload);
    res.status(201).json(newAsset);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ message: 'An asset with this serial number already exists.' });
    }
    res.status(500).json({ message: 'Error creating asset.' });
  }
});

// PUT /api/assets/:id - Update an existing asset
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const allowedStatuses = new Set(['OPERATIONAL', 'IN_REPAIR', 'DECOMMISSIONED']);
    const patch: any = {};
    if (typeof body.name === 'string') patch.name = body.name.trim();
    if (typeof body.model === 'string') patch.model = body.model.trim();
    if (typeof body.serialNumber === 'string') patch.serialNumber = body.serialNumber.trim();
    if (typeof body.location === 'string') patch.location = body.location.trim();
    if (typeof body.status === 'string') {
      const s = body.status.trim();
      if (!allowedStatuses.has(s)) return res.status(400).json({ message: 'Invalid status value' });
      patch.status = s;
    }
    if (body.purchaseDate) patch.purchaseDate = new Date(body.purchaseDate);
    if (typeof body.department === 'string') patch.department = body.department.trim();
    if (typeof body.building === 'string') patch.building = body.building.trim();
    if (typeof body.room === 'string') patch.room = body.room.trim();
    if (typeof body.custodianId === 'string') patch.custodianId = body.custodianId.trim();
    if (typeof body.custodianName === 'string') patch.custodianName = body.custodianName.trim();
    const actorUserId = (req as any).user?.id as string | undefined;
    patch.actorUserId = actorUserId;
    const updatedAsset = await assetService.updateAsset(req.params.id, patch);
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

// PATCH /api/assets/:id/status - Update only status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const allowedStatuses = new Set(['OPERATIONAL', 'IN_REPAIR', 'DECOMMISSIONED']);
    const status = typeof req.body?.status === 'string' ? req.body.status.trim() : '';
    if (!allowedStatuses.has(status)) return res.status(400).json({ message: 'Invalid status' });
    const actorUserId = (req as any).user?.id as string | undefined;
    const updated = await assetService.patchStatus(req.params.id, status, actorUserId);
    if (!updated) return res.status(404).json({ message: 'Asset not found.' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating status.' });
  }
});

// POST /api/assets/:id/assign - Update assignment fields
router.post('/:id/assign', async (req: Request, res: Response) => {
  try {
    const actorUserId = (req as any).user?.id as string | undefined;
    const assignment = {
      department: typeof req.body?.department === 'string' ? req.body.department.trim() : undefined,
      building: typeof req.body?.building === 'string' ? req.body.building.trim() : undefined,
      room: typeof req.body?.room === 'string' ? req.body.room.trim() : undefined,
      custodianId: typeof req.body?.custodianId === 'string' ? req.body.custodianId.trim() : undefined,
      custodianName: typeof req.body?.custodianName === 'string' ? req.body.custodianName.trim() : undefined,
    };
    const updated = await assetService.assignAsset(req.params.id, assignment, actorUserId);
    if (!updated) return res.status(404).json({ message: 'Asset not found.' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error assigning asset.' });
  }
});

// GET /api/assets/:id/activity - Get asset activity logs
router.get('/:id/activity', async (req: Request, res: Response) => {
  try {
    const rows = await assetService.getActivity(req.params.id);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity.' });
  }
});

export default router;
