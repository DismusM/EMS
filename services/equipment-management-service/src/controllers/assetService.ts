import { db } from '../db';
import { assets, assetActivity } from '../db/schema';
import { and, eq } from 'drizzle-orm';

type Asset = typeof assets.$inferInsert;

export async function getAllAssets(filters?: {
  status?: string;
  q?: string;
  location?: string;
  department?: string;
  custodianName?: string;
}) {
  const whereClauses: any[] = [];
  if (filters?.status) whereClauses.push(eq(assets.status, filters.status));
  if (filters?.location) whereClauses.push(eq(assets.location, filters.location));
  if (filters?.department) whereClauses.push(eq(assets.department, filters.department));
  if (filters?.custodianName) whereClauses.push(eq(assets.custodianName, filters.custodianName));

  // Basic search across name, model, serial, location
  // Note: SQLite like() is case-insensitive by default
  const hasQ = !!filters?.q && filters.q!.trim().length > 0;
  const q = hasQ ? `%${filters!.q!.trim()}%` : undefined;

  if (hasQ) {
    // We cannot OR easily with the simplified builder without writing SQL; fetch and filter client-side for q
    const rows = await db.query.assets.findMany({
      where: whereClauses.length ? and(...whereClauses) : undefined,
    });
    const needle = filters!.q!.trim().toLowerCase();
    return rows.filter(a =>
      a.name.toLowerCase().includes(needle) ||
      (a.model || '').toLowerCase().includes(needle) ||
      (a.serialNumber || '').toLowerCase().includes(needle) ||
      (a.location || '').toLowerCase().includes(needle) ||
      (a.department || '').toLowerCase().includes(needle) ||
      (a.custodianName || '').toLowerCase().includes(needle)
    );
  }

  return db.query.assets.findMany({
    where: whereClauses.length ? and(...whereClauses) : undefined,
  });
}

export async function getAssetById(id: string) {
  return db.query.assets.findFirst({
    where: eq(assets.id, id),
  });
}

export async function createAsset(assetData: any) {
  const toInsert: any = {
    name: assetData.name,
    model: assetData.model,
    serialNumber: assetData.serial ?? assetData.serialNumber,
    location: assetData.location,
    status: assetData.status, // Expect OPERATIONAL | IN_REPAIR | DECOMMISSIONED
    purchaseDate: assetData.purchaseDate ? new Date(assetData.purchaseDate) : undefined,
    department: assetData.department,
    building: assetData.building,
    room: assetData.room,
    custodianId: assetData.custodianId,
    custodianName: assetData.custodianName,
  };
  await db.insert(assets).values(toInsert);
  const created = await db.query.assets.findFirst({ where: eq(assets.serialNumber, toInsert.serialNumber) });
  if (created) {
    await logActivity(created.id, 'CREATED', assetData.actorUserId, null, created);
  }
  return created!;
}

export async function updateAsset(id: string, assetData: any) {
  const before = await getAssetById(id);
  const toUpdate: any = {
    name: assetData.name,
    model: assetData.model,
    serialNumber: assetData.serial ?? assetData.serialNumber,
    location: assetData.location,
    status: assetData.status, // Expect OPERATIONAL | IN_REPAIR | DECOMMISSIONED
    purchaseDate: assetData.purchaseDate ? new Date(assetData.purchaseDate) : undefined,
    updatedAt: new Date(),
    department: assetData.department,
    building: assetData.building,
    room: assetData.room,
    custodianId: assetData.custodianId,
    custodianName: assetData.custodianName,
  };
  await db.update(assets)
    .set(toUpdate)
    .where(eq(assets.id, id));
  const after = await getAssetById(id);
  await logActivity(id, 'UPDATED', assetData.actorUserId, before, after);
  return after;
}

export async function deleteAsset(id: string) {
  // Soft delete: mark as DECOMMISSIONED
  const before = await getAssetById(id);
  await db.update(assets).set({ status: 'DECOMMISSIONED', updatedAt: new Date() }).where(eq(assets.id, id));
  const after = await getAssetById(id);
  await logActivity(id, 'RETIRED', undefined, before, after);
  return after;
}

export async function patchStatus(id: string, status: string, actorUserId?: string) {
  const before = await getAssetById(id);
  await db.update(assets).set({ status, updatedAt: new Date() }).where(eq(assets.id, id));
  const after = await getAssetById(id);
  await logActivity(id, 'STATUS_CHANGED', actorUserId, before, after);
  return after;
}

export async function assignAsset(id: string, assignment: {
  department?: string;
  building?: string;
  room?: string;
  custodianId?: string;
  custodianName?: string;
}, actorUserId?: string) {
  const before = await getAssetById(id);
  await db.update(assets)
    .set({
      department: assignment.department,
      building: assignment.building,
      room: assignment.room,
      custodianId: assignment.custodianId,
      custodianName: assignment.custodianName,
      updatedAt: new Date(),
    })
    .where(eq(assets.id, id));
  const after = await getAssetById(id);
  await logActivity(id, 'ASSIGNED', actorUserId, before, after);
  return after;
}

export async function getActivity(assetId: string) {
  return db.select().from(assetActivity).where(eq(assetActivity.assetId, assetId));
}

async function logActivity(assetId: string, action: string, actorUserId?: string, before?: any, after?: any) {
  await db.insert(assetActivity).values({
    assetId,
    action,
    actorUserId,
    beforeJson: before ? JSON.stringify(before) : null as any,
    afterJson: after ? JSON.stringify(after) : null as any,
  } as any);
}
