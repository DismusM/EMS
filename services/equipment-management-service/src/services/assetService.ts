import { db } from '../db';
import { assets } from '../db/schema';
import { eq } from 'drizzle-orm';

type Asset = typeof assets.$inferInsert;

export async function getAllAssets() {
  return db.query.assets.findMany();
}

export async function getAssetById(id: string) {
  return db.query.assets.findFirst({
    where: eq(assets.id, id),
  });
}

export async function createAsset(assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) {
  const newAsset = {
    id: crypto.randomUUID(),
    ...assetData,
  };
  await db.insert(assets).values(newAsset);
  return getAssetById(newAsset.id);
}

export async function updateAsset(id: string, assetData: Partial<Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>>) {
  await db.update(assets)
    .set({ ...assetData, updatedAt: new Date() })
    .where(eq(assets.id, id));
  return getAssetById(id);
}

export async function deleteAsset(id: string) {
  await db.delete(assets).where(eq(assets.id, id));
  return { id };
}
