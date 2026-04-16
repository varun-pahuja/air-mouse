import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,          // ← was missing: requests now time-out after 8 s
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Response interceptor: normalise and log errors ─────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url    = error.config?.url;

    if (status === 404) {
      console.warn(`[api] 404 Not Found: ${url}`);
    } else if (status >= 500) {
      console.error(`[api] Server error ${status}: ${url}`);
    } else if (error.code === 'ECONNABORTED') {
      console.warn(`[api] Request timed out: ${url}`);
    } else {
      console.error('[api] Request failed:', error.message);
    }

    // Always reject so callers can handle the error
    return Promise.reject(error);
  }
);

// ── Settings API (MongoDB) ─────────────────────────────────────────────────
export const getSettings     = ()           => api.get('/settings');
export const updateSettings  = (settings)   => api.put('/settings', settings);
export const resetSettings   = ()           => api.post('/settings/reset');

// ── Usage API (MongoDB) ────────────────────────────────────────────────────
export const logUsage        = (data)       => api.post('/usage/log', data);
export const getUsageStats   = (period='7d')=> api.get(`/usage/stats?period=${period}`);
export const getRecentLogs   = (limit=50)   => api.get(`/usage/recent?limit=${limit}`);

// ── Team / Components API ─────────────────────────────────────────────────
export const getTeam         = ()           => api.get('/team');
export const getComponents   = ()           => api.get('/components');

// ── ESP32 Real-Time APIs ───────────────────────────────────────────────────
export const getESP32Status   = ()           => api.get('/esp32/status');
export const getESP32Settings = ()           => api.get('/esp32/settings');
export const updateESP32Settings = (s)       => api.post('/esp32/settings', s);
export const getESP32Stats    = ()           => api.get('/esp32/stats');
export const resetESP32Stats  = ()           => api.post('/esp32/stats/reset');
export const getESP32Info     = ()           => api.get('/esp32/info');

export default api;