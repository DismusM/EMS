import * as users from './users';
import * as roles from './roles';
import * as refreshTokens from './refreshTokens';
import * as assets from '../../../equipment-management-service/src/db/schema';

// Beginner note: This file brings all our database table definitions together.
// It makes it easy for other parts of our app to use them.
export const schema = {
    ...users,
    ...roles,
    ...refreshTokens,
    ...assets,
};
