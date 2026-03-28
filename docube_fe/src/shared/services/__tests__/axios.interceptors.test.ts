/**
 * Axios Interceptors Tests
 * Kiểm tra request interceptor (attach token) và response interceptor (401 refresh flow)
 */
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// ── vi.hoisted: khai báo trước khi vi.mock hoist ────────────────────────────
const { mockAxiosCallable, mockRequestUse, mockResponseUse } = vi.hoisted(() => {
  const mockRequestUse = vi.fn();
  const mockResponseUse = vi.fn();
  const mockAxiosCallable = vi.fn();

  return { mockAxiosCallable, mockRequestUse, mockResponseUse };
});

// ── Mocks ────────────────────────────────────────────────────────────────────
vi.mock('axios', () => {
  const instance = Object.assign(mockAxiosCallable, {
    interceptors: {
      request: { use: mockRequestUse },
      response: { use: mockResponseUse },
    },
  });
  return { default: { create: vi.fn(() => instance) } };
});

const mockClearAuth = vi.fn();
const mockSetAccessToken = vi.fn();
const mockSetLoginModalOpen = vi.fn();

let mockStoreState = {
  accessToken: null as string | null,
  refreshToken: null as string | null,
  clearAuth: mockClearAuth,
  setAccessToken: mockSetAccessToken,
  setLoginModalOpen: mockSetLoginModalOpen,
};

vi.mock('@/stores', () => ({
  useAuthStore: {
    getState: () => mockStoreState,
    setState: vi.fn((partial: Partial<typeof mockStoreState>) => {
      mockStoreState = { ...mockStoreState, ...partial };
    }),
  },
}));

// Import module để trigger interceptor registration
import '@/shared/services/axios';

// ── Capture interceptors ONCE at module level (before any beforeEach clears mocks)
type RequestFulfilled = (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
type ResponseFulfilled = (res: AxiosResponse) => AxiosResponse;
type ResponseRejected = (err: AxiosError) => Promise<unknown>;

// Được gán sau khi module load xong, trước khi tests chạy
let requestInterceptor: RequestFulfilled;
let responseSuccessInterceptor: ResponseFulfilled;
let responseErrorInterceptor: ResponseRejected;

// Chạy 1 lần trước tất cả describe blocks để capture interceptors
beforeAll(() => {
  requestInterceptor = mockRequestUse.mock.calls[0][0] as RequestFulfilled;
  responseSuccessInterceptor = mockResponseUse.mock.calls[0][0] as ResponseFulfilled;
  responseErrorInterceptor = mockResponseUse.mock.calls[0][1] as ResponseRejected;
});

// ── Helpers ──────────────────────────────────────────────────────────────────
function makeConfig(extra: Partial<InternalAxiosRequestConfig> = {}): InternalAxiosRequestConfig {
  return { headers: {} as InternalAxiosRequestConfig['headers'], ...extra } as InternalAxiosRequestConfig;
}

function makeAxiosError(status: number, config?: InternalAxiosRequestConfig): AxiosError {
  const err = new Error('Request failed') as AxiosError;
  err.isAxiosError = true;
  const cfg = config ?? makeConfig();
  err.response = { status, data: {}, headers: {}, config: cfg, statusText: '' } as AxiosResponse;
  err.config = cfg;
  return err;
}

// ── Tests ────────────────────────────────────────────────────────────────────
beforeEach(() => {
  vi.clearAllMocks();
  mockStoreState = {
    accessToken: null,
    refreshToken: null,
    clearAuth: mockClearAuth,
    setAccessToken: mockSetAccessToken,
    setLoginModalOpen: mockSetLoginModalOpen,
  };
});

describe('Axios Request Interceptor', () => {
  it('nên attach Authorization header khi có accessToken', () => {
    mockStoreState.accessToken = 'my-bearer-token';
    const config = makeConfig();
    const result = requestInterceptor(config);
    expect((result.headers as Record<string, string>)['Authorization']).toBe('Bearer my-bearer-token');
  });

  it('nên không attach Authorization header khi không có accessToken', () => {
    mockStoreState.accessToken = null;
    const config = makeConfig();
    const result = requestInterceptor(config);
    expect((result.headers as Record<string, string>)['Authorization']).toBeUndefined();
  });
});

describe('Axios Response Interceptor', () => {
  it('nên pass-through response thành công', () => {
    const mockResponse = { status: 200, data: {} } as AxiosResponse;
    expect(responseSuccessInterceptor(mockResponse)).toBe(mockResponse);
  });

  it('nên gọi clearAuth và setLoginModalOpen(true) khi 401 và không có refreshToken', async () => {
    mockStoreState.refreshToken = null;
    const error = makeAxiosError(401);

    await expect(responseErrorInterceptor(error)).rejects.toBeDefined();

    expect(mockClearAuth).toHaveBeenCalledOnce();
    expect(mockSetLoginModalOpen).toHaveBeenCalledWith(true);
  });

  it('nên không trigger refresh khi lỗi 500', async () => {
    const error = makeAxiosError(500);

    await expect(responseErrorInterceptor(error)).rejects.toBeDefined();

    expect(mockClearAuth).not.toHaveBeenCalled();
    expect(mockSetAccessToken).not.toHaveBeenCalled();
  });

  it('nên không trigger refresh khi lỗi 403', async () => {
    const error = makeAxiosError(403);

    await expect(responseErrorInterceptor(error)).rejects.toBeDefined();

    expect(mockClearAuth).not.toHaveBeenCalled();
  });

  it('nên không gọi clearAuth khi request đã được đánh dấu _retry', async () => {
    mockStoreState.refreshToken = null;
    const config = makeConfig({ _retry: true } as InternalAxiosRequestConfig);
    const error = makeAxiosError(401, config);

    // _retry=true → bỏ qua block 401 (condition !_retry là false) → reject trực tiếp
    await expect(responseErrorInterceptor(error)).rejects.toBeDefined();
    expect(mockClearAuth).not.toHaveBeenCalled();
  });
});
