import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const assets = sqliteTable('assets', {
  id: text('id').notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  model: text('model'),
  serialNumber: text('serial_number').notNull().unique(),
  location: text('location'),
  status: text('status').notNull(), // e.g., 'OPERATIONAL', 'IN_REPAIR', 'DECOMMISSIONED'
  purchaseDate: integer('purchase_date', { mode: 'timestamp' }),
  // New optional metadata fields
  department: text('department'),
  building: text('building'),
  room: text('room'),
  custodianId: text('custodian_id'), // optional FK to users service; string for cross-service compatibility
  custodianName: text('custodian_name'), // free-text fallback/display
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});

// Basic activity log for assets
export const assetActivity = sqliteTable('asset_activity', {
  id: text('id').notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  assetId: text('asset_id').notNull(),
  action: text('action').notNull(), // CREATED, UPDATED, STATUS_CHANGED, ASSIGNED, RETIRED
  actorUserId: text('actor_user_id'), // who performed the action
  beforeJson: text('before_json'), // JSON string snapshot before
  afterJson: text('after_json'), // JSON string snapshot after
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});
