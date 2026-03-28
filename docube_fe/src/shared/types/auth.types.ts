/**
 * Auth Types - TypeScript types mapping chính xác với Auth Service backend DTOs & domain models
 */

// =============================================================================
// DOMAIN MODELS (mapped from Kotlin data classes)
// =============================================================================

export interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  avatar: string;
  twoFaEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Token {
  id: string;
  userId: string;
  token: string;
  ua: string;
  createdAt?: string;
}

export interface Permission {
  id: string;
  name: string;       // format: "resource:action" e.g. "user:view"
  description: string;
}

export interface Role {
  id: string;
  name: string;         // format: "UPPER_SNAKE_CASE" e.g. "SUPER_ADMIN"
  description: string;
  permissions: Permission[];
}

// =============================================================================
// API WRAPPER
// =============================================================================

export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
}

// =============================================================================
// AUTH - REQUEST DTOs
// =============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleAuthRequest {
  token: string;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}

export interface OtpRequest {
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  otp: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  token: string;
}

export interface LogoutDevicesRequest {
  deviceIds: string[];
}

// =============================================================================
// AUTH - RESPONSE DTOs
// =============================================================================

export interface LoginResponse {
  accessToken: string;
  accessTokenType: string; // "Bearer" = logged in, "2FA" = needs 2FA OTP, "FORGOT_PASSWORD" = temp token
  refreshToken?: string;
  clientId?: string;
  userId?: string;
}

export interface TotpSetupResponse {
  secret: string;
  qrCodeUrl: string;
}

// =============================================================================
// PROFILE - REQUEST DTOs
// =============================================================================

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// =============================================================================
// USER - REQUEST DTOs (Admin)
// =============================================================================

export type UserStatus = 'PENDING' | 'ACTIVE' | 'BANNED';

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  status?: UserStatus;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  is2FAEnabled?: boolean;
}

export interface UpdateRoleRequest {
  roles: string[];
}

// =============================================================================
// ROLE - REQUEST DTOs (Admin)
// =============================================================================

export interface CreateUpdateRoleRequest {
  name: string;         // UPPER_SNAKE_CASE
  description: string;
  permissions: string[]; // UUIDs
}

// =============================================================================
// PERMISSION - REQUEST DTOs (Admin)
// =============================================================================

export interface CreateUpdatePermissionRequest {
  name: string;         // format: "resource:action"
  description: string;
}
