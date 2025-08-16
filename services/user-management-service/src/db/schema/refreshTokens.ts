import { pgTable, text, timestamp, uuid, pgTableCreator } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

// Create a table with the correct type inference
const createTable = pgTableCreator((name) => `user_${name}`);

export const refreshTokens = createTable('refresh_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
});

// Define the relations in a separate export to avoid circular dependencies
export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));
