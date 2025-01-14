import { ApiResponse } from '../common/api';

/**
 * User roles
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

/**
 * Base user interface
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

/**
 * Registration request body
 */
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

/**
 * Login request body
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Auth response with token
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Current user response
 */
export interface MeResponse {
  user: User;
} 
