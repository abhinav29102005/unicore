import { useAuthStore } from '../store/authStore';

export const BASE_URL =
  import.meta.env.VITE_API_URL || 'https://unicore-backend.bigboyaks-account.workers.dev/api';

// Simple fetch wrapper that injects auth token
export const api = async (endpoint: string, options: RequestInit = {}) => {
  const { token, logout } = useAuthStore.getState();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  headers.set('Content-Type', 'application/json');

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${BASE_URL.replace(/\/$/, '')}${cleanEndpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    logout();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'API request failed');
  }

  return response.json();
};
