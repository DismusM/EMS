import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { users } from './users';
import { roles } from './roles';
import { refreshTokens } from './refreshTokens';

// Export types for each table
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Role = InferSelectModel<typeof roles>;
export type NewRole = InferInsertModel<typeof roles>;

export type RefreshToken = InferSelectModel<typeof refreshTokens>;
export type NewRefreshToken = InferInsertModel<typeof refreshTokens>;
