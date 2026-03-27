/**
 * Auth API - Tất cả các API liên quan đến xác thực
 * Base: /api/v1/auth
 */
import axiosInstance from './axios';
import type {
  LoginRequest,
  LoginResponse,
  GoogleAuthRequest,
  RegisterRequest,
  OtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  LogoutDevicesRequest,
  Token,
  Role,
  ApiResponse,
} from '@/shared/types';

export const authApi = {
  /**
   * POST /auth/login
   * Đăng nhập bằng email/password
   * Response: LoginResponse
   *   - accessTokenType = "Bearer"   → đăng nhập thành công
   *   - accessTokenType = "2FA"      → cần nhập OTP 2FA (accessToken là temp token)
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return response.data.data!;
  },

  /**
   * POST /auth/google
   * Đăng nhập bằng Google ID token
   */
  loginGoogle: async (data: GoogleAuthRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/google', data);
    return response.data.data!;
  },

  /**
   * POST /auth/register
   * Đăng ký tài khoản mới
   */
  register: async (data: RegisterRequest): Promise<void> => {
    await axiosInstance.post('/auth/register', data);
  },

  /**
   * POST /auth/verify-email
   * Xác thực email bằng OTP (cần Bearer token)
   */
  verifyEmail: async (otp: string): Promise<void> => {
    const body: OtpRequest = { otp };
    await axiosInstance.post('/auth/verify-email', body);
  },

  /**
   * POST /auth/send-verification-email
   * Gửi OTP xác thực email (cần Bearer token)
   */
  sendVerificationEmail: async (): Promise<void> => {
    await axiosInstance.post('/auth/send-verification-email');
  },

  /**
   * POST /auth/forgot-password
   * Kích hoạt quá trình quên mật khẩu → server gửi OTP qua email
   * Response trả về temporary LoginResponse (accessToken dùng để gọi reset-password)
   */
  forgotPassword: async (email: string): Promise<LoginResponse> => {
    const body: ForgotPasswordRequest = { email };
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/forgot-password', body);
    return response.data.data!;
  },

  /**
   * POST /auth/send-verification-password
   * Gửi lại OTP reset mật khẩu (cần Bearer token)
   */
  sendVerificationPassword: async (): Promise<void> => {
    await axiosInstance.post('/auth/send-verification-password');
  },

  /**
   * POST /auth/reset-password
   * Đặt lại mật khẩu bằng OTP (cần Bearer token của forgot-password flow)
   */
  resetPassword: async (otp: string, newPassword: string): Promise<void> => {
    const body: ResetPasswordRequest = { otp, newPassword };
    await axiosInstance.post('/auth/reset-password', body);
  },

  /**
   * POST /auth/2fa
   * Xác thực 2FA bằng TOTP OTP (cần Bearer token "2FA" từ login response)
   * Response: LoginResponse với accessTokenType = "Bearer"
   */
  authenticate2FA: async (otp: string): Promise<LoginResponse> => {
    const body: OtpRequest = { otp };
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/2fa', body);
    return response.data.data!;
  },

  /**
   * POST /auth/refresh
   * Refresh access token bằng refresh token
   */
  refreshToken: async (token: string): Promise<LoginResponse> => {
    const body: RefreshTokenRequest = { token };
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/refresh', body);
    return response.data.data!;
  },

  /**
   * POST /auth/logout
   * Đăng xuất một hoặc nhiều thiết bị (cần Bearer token)
   */
  logout: async (deviceIds: string[]): Promise<void> => {
    const body: LogoutDevicesRequest = { deviceIds };
    await axiosInstance.post('/auth/logout', body);
  },

  /**
   * GET /auth/devices
   * Lấy danh sách thiết bị đang đăng nhập (cần Bearer token)
   */
  getDevices: async (): Promise<Token[]> => {
    const response = await axiosInstance.get<ApiResponse<Token[]>>('/auth/devices');
    return response.data.data!;
  },

  /**
   * GET /auth/roles
   * Lấy danh sách role của user hiện tại (cần Bearer token)
   */
  getMyRoles: async (): Promise<Role[]> => {
    const response = await axiosInstance.get<ApiResponse<Role[]>>('/auth/roles');
    return response.data.data!;
  },
};
