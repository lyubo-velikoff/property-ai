import { UserRole } from '@avalon/shared-types';

export const USER_ROLES: Record<string, UserRole> = {
  USER: 'USER',
  ADMIN: 'ADMIN'
} as const; 
