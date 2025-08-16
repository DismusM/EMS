import { pgTable, text, timestamp, uuid, varchar, pgTableCreator } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

// Create a table with the correct type inference
const createTable = pgTableCreator((name) => `user_${name}`);

export const roles = createTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: text('description'),
  permissions: text('permissions').array().notNull().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Define the relations in a separate export to avoid circular dependencies
export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));
