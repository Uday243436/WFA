import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiErrorResponse } from '../types/api.types';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
const apiTimeout = Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000);

export class ApiClientError extends Error implements ApiErrorResponse {
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
  isNetworkError: boolean;

  constructor(error: ApiErrorResponse) {
    super(error.message);
    this.name = 'ApiClientError';
    this.status = error.status;
    this.code = error.code;
    this.details = error.details;
    this.isNetworkError = error.isNetworkError;
  }
}

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: apiTimeout,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Client-Name': 'workforce-analytics-platform',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.set('X-Request-Id', crypto.randomUUID());
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => Promise.reject(normalizeApiError(error)),
);

export function normalizeApiError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const responseData = error.response?.data;
    return new ApiClientError({
      message: responseData?.message || error.message || 'API request failed',
      status: error.response?.status,
      code: responseData?.code || error.code,
      details: responseData?.details,
      isNetworkError: !error.response,
    });
  }

  if (error instanceof Error) {
    return new ApiClientError({
      message: error.message,
      isNetworkError: false,
    });
  }

  return new ApiClientError({
    message: 'Unexpected API error',
    isNetworkError: false,
  });
}

export function shouldUseMockFallback(error?: unknown): boolean {
  if (!apiBaseUrl) {
    return true;
  }

  if (!error) {
    return import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false';
  }

  const normalized = normalizeApiError(error);
  return import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false' && normalized.isNetworkError;
}

export default apiClient;
