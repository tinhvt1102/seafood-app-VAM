/**
 * API Client wrapper using Fetch API with support for:
 * - Base URL configuration via environment variables
 * - Request authorization headers (auto bearer token injection)
 * - Automatic JWT Refresh Token handling on 401 Unauthorized
 * - Response JSON parsing & error handling
 * - Standard HTTP methods (GET, POST, PUT, DELETE)
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vam-be.onrender.com/api';

/**
 * Custom error class for API responses
 */
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Token helper functions
function getStoredAccessToken() {
  let token = localStorage.getItem('token');
  if (!token) {
    try {
      const userObj = JSON.parse(localStorage.getItem('currentUser') || '{}');
      token = userObj.token || null;
    } catch {
      token = null;
    }
  }
  return token;
}

function getStoredRefreshToken() {
  let refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    try {
      const userObj = JSON.parse(localStorage.getItem('currentUser') || '{}');
      refreshToken = userObj.refreshToken || null;
    } catch {
      refreshToken = null;
    }
  }
  return refreshToken;
}

function saveTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem('token', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  try {
    const userObj = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (userObj && typeof userObj === 'object') {
      if (accessToken) userObj.token = accessToken;
      if (refreshToken) userObj.refreshToken = refreshToken;
      localStorage.setItem('currentUser', JSON.stringify(userObj));
    }
  } catch {
    // Ignore JSON parse error
  }
}

function clearTokens() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
}

// Variables for concurrency refresh token handling
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, newToken = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(newToken);
    }
  });
  failedQueue = [];
};

/**
 * Main request sender wrapper
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getStoredAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    const contentType = response.headers.get('content-type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const isAuthRefreshEndpoint = endpoint.includes('Auth/refresh-token') || endpoint.includes('auth/refresh-token');

      // Handle 401 Unauthorized token expiration
      if (response.status === 401 && !options._isRetry && !isAuthRefreshEndpoint) {
        const refreshToken = getStoredRefreshToken();

        if (refreshToken) {
          if (isRefreshing) {
            // Queue request while refresh is in progress
            try {
              const newToken = await new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              });
              return request(endpoint, {
                ...options,
                headers: {
                  ...options.headers,
                  Authorization: `Bearer ${newToken}`,
                },
                _isRetry: true,
              });
            } catch (err) {
              throw err;
            }
          }

          isRefreshing = true;

          try {
            const refreshUrl = `${BASE_URL.replace(/\/$/, '')}/Auth/refresh-token`;
            const refreshResponse = await fetch(refreshUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken }),
            });

            if (!refreshResponse.ok) {
              throw new Error('Refresh token expired');
            }

            const refreshData = await refreshResponse.json();
            const newAccessToken = refreshData.token || refreshData.accessToken;
            const newRefreshToken = refreshData.refreshToken;

            if (!newAccessToken) {
              throw new Error('Invalid refresh token response');
            }

            saveTokens(newAccessToken, newRefreshToken);
            processQueue(null, newAccessToken);
            isRefreshing = false;

            // Retry original request with new access token
            return request(endpoint, {
              ...options,
              headers: {
                ...options.headers,
                Authorization: `Bearer ${newAccessToken}`,
              },
              _isRetry: true,
            });
          } catch (refreshErr) {
            processQueue(refreshErr, null);
            isRefreshing = false;
            clearTokens();
            window.dispatchEvent(new Event('auth-expired'));
            throw new ApiError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 401, null);
          }
        } else {
          clearTokens();
          window.dispatchEvent(new Event('auth-expired'));
        }
      }

      const errorMessage = data?.message || data?.error || `API request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Lỗi kết nối mạng', 500, null);
  }
}

// HTTP helper methods
export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};
