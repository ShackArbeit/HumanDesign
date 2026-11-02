import { getFirebaseAuth } from '../lib/firebase';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
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

function buildUrl(path, params = {}) {
  const query = new URLSearchParams();

  for (const key of Object.keys(params)) {
    const value = params[key];
    if (value !== undefined && value !== null) {
      query.set(key, value);
    }
  }

  const queryString = query.toString();
  if (queryString) {
    return `${BASE_URL}${path}?${queryString}`;
  }
  return `${BASE_URL}${path}`;
}

async function buildHeaders(hasBody) {
  const headers = {};

  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }

  const currentUser = getFirebaseAuth().currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function sendRequest(url, options) {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError({ status: 0, code: 'TIMEOUT', message: '連線逾時，請稍後再試' });
    }
    throw new ApiError({
      status: 0,
      code: 'NETWORK_ERROR',
      message: '無法連線到伺服器，請稍後再試',
    });
  }
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  const method = options.method || 'GET';
  const hasBody = options.body !== undefined;
  const headers = await buildHeaders(hasBody);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await sendRequest(buildUrl(path, options.params), {
      method,
      headers,
      body: hasBody ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
    const json = await readJson(response);

    if (!response.ok) {
      const error = json && json.error ? json.error : {};
      throw new ApiError({
        status: response.status,
        code: error.code || 'INTERNAL',
        message: error.message || '伺服器發生錯誤，請稍後再試',
        details: error.details,
      });
    }

    return json ? json.data : undefined;
  } finally {
    clearTimeout(timer);
  }
}
