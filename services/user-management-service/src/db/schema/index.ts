// Import schema definitions
import { users } from './users';
import { usersRelations } from './users';
import { roles } from './roles';
import { rolesRelations } from './roles';
import { refreshTokens } from './refreshTokens';
import { refreshTokensRelations } from './refreshTokens';

// Re-export all schema components
export {
  users,
  usersRelations,
  roles,
  rolesRelations,
  refreshTokens,
  refreshTokensRelations,
};

// Export the complete schema object for Drizzle ORM
export const schema = {
  users,
  roles,
  refreshTokens,
  usersRelations,
  rolesRelations,
  refreshTokensRelations,
};
