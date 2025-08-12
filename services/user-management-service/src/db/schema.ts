import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

export const roles = sqliteTable('roles', {
  id: text('id').notNull().primaryKey(), // e.g., 'admin', 'technician'
  name: text('name').notNull().unique(), // e.g., 'Administrator', 'Technician'
});

export const users = sqliteTable('users', {
  id: text('id').notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  roleId: text('role_id').notNull().references(() => roles.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));
