import { supabase } from '../supabase';
import type { ApiResponse } from '../types/api';

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

if (!API_URL) {
  throw new Error('Missing API URL. Please check your .env file.');
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function getAuthToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  skipAuth?: boolean;
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { body, skipAuth = false, headers = {}, ...restOptions } = options;
  const shouldLogHistory = endpoint.includes('/schedule/sessions/history');

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = await getAuthToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${API_URL}${endpoint}`;
  if (shouldLogHistory) {
    console.log('[API][history] request', { url });
  }

  const config: RequestInit = {
    ...restOptions,
    headers: requestHeaders,
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    if (shouldLogHistory) {
      console.log('[API][history] response', { status: response.status });
    }
    const data: ApiResponse<T> = await response.json();

    // Handle API error responses
    if (!data.success) {
      if (shouldLogHistory) {
        console.error('[API][history] error', {
          statusCode: data.error.statusCode,
          message: data.error.message,
        });
      }
      throw new ApiError(
        data.error.statusCode,
        data.error.message,
        data.error.details
      );
    }
    if (shouldLogHistory) {
      console.log('[API][history] success', { hasData: data.data !== undefined });
    }

    return data.data;
  } catch (error) {
    if (shouldLogHistory) {
      console.error('[API][history] exception', {
        message: error instanceof Error ? error.message : String(error),
      });
    }
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ApiError(0, error.message);
    }

    throw new ApiError(0, 'An unknown error occurred');
  }
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'POST', body }),

  patch: <T>(endpoint: string, body?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'PATCH', body }),

  put: <T>(endpoint: string, body?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'PUT', body }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};
