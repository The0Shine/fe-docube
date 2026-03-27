/**
 * Axios Instance - HTTP client với interceptors
 * - Request: Auto-attach Bearer token
 * - Response: Auto-refresh token khi 401, redirect khi hết hạn hoàn toàn
 */
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor ────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Response Interceptor ───────────────────────────────────────────────────
// Track refresh state để tránh refresh loop
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    // ── 401: Thử refresh token ───────────────────────────────────────────
    if (status === 401 && !originalRequest._retry) {
      const { refreshToken } = useAuthStore.getState();

      // Không có refresh token → clear và trigger login modal
      if (!refreshToken) {
        useAuthStore.getState().clearAuth();
        useAuthStore.getState().setLoginModalOpen(true);
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Đợi cho refresh request hiện tại hoàn thành
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Import dynamic để tránh circular dependency
        const { authApi } = await import('./auth.api');
        const loginResponse = await authApi.refreshToken(refreshToken);
        const newToken = loginResponse.accessToken;

        useAuthStore.getState().setAccessToken(newToken);
        // Cập nhật refreshToken mới nếu backend trả về
        if (loginResponse.refreshToken) {
          useAuthStore.setState({ refreshToken: loginResponse.refreshToken });
        }

        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        useAuthStore.getState().clearAuth();
        useAuthStore.getState().setLoginModalOpen(true);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ── 403: Forbidden ───────────────────────────────────────────────────
    if (status === 403) {
      console.error('Access forbidden:', error.config?.url);
    }

    // ── 5xx: Server error ────────────────────────────────────────────────
    if (status && status >= 500) {
      console.error('Server error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
