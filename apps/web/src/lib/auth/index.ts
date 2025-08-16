// Re-export all named exports from auth utilities
export * from './auth';

// Export the useAuth hook and its types
export { useAuth } from './useAuth';

export type { AuthContextType } from './useAuth';

// Export auth utilities for direct import if needed
export const authUtils = {
  ...require('./auth'),
};
