import { getFirebaseAuth } from '../lib/firebase';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';
const TIMEOUT_MS = 10000;

export class ApiError extends Error {
  constructor({ status, code, message, details }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const buildUrl = (path, params) => {
  const query = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) query.set(key, value);
  });
  const search = query.toString();
  return `${BASE_URL}${path}${search ? `?${search}` : ''}`;
};

const buildHeaders = async (hasBody) => {
  const headers = {};
  if (hasBody) headers['Content-Type'] = 'application/json';
  const token = await getFirebaseAuth().currentUser?.getIdToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const parseBody = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const send = async (url, init) => {
  try {
    return await fetch(url, init);
  } catch (error) {
    const isTimeout = error.name === 'AbortError';
    throw new ApiError({
      status: 0,
      code: isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
      message: isTimeout ? '連線逾時，請稍後再試' : '無法連線到伺服器，請稍後再試',
    });
  }
};

export const apiRequest = async (path, { method = 'GET', params, body } = {}) => {
  const hasBody = body !== undefined;
  const headers = await buildHeaders(hasBody);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await send(buildUrl(path, params), {
      method,
      headers,
      body: hasBody ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const payload = await parseBody(response);
    if (!response.ok) {
      throw new ApiError({
        status: response.status,
        code: payload?.error?.code ?? 'INTERNAL',
        message: payload?.error?.message ?? '伺服器發生錯誤，請稍後再試',
        details: payload?.error?.details,
      });
    }
    return payload?.data;
  } finally {
    clearTimeout(timer);
  }
};
