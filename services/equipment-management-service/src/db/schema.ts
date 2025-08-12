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
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});
