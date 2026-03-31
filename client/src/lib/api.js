import { apiRequest } from "./apiClient";

export async function apiFetch(endpoint, { body, method = "GET", token } = {}) {
  return apiRequest(endpoint, {
    method,
    body,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    auth: false,
  });
}

/* ---- Auth helpers ---- */

export const userAuth = {
  requestLoginOtp: (phoneNumber) =>
    apiFetch('/user/auth/login/request-otp', { method: 'POST', body: { phoneNumber } }),

  resendLoginOtp: (phoneNumber) =>
    apiFetch('/user/auth/login/resend-otp', { method: 'POST', body: { phoneNumber } }),

  loginWithPhone: (phoneNumber, otp) =>
    apiFetch('/user/auth/login/phone', { method: 'POST', body: { phoneNumber, otp } }),

  loginWithEmail: (email, password) =>
    apiFetch('/user/auth/login', { method: 'POST', body: { email, password } }),

  initiateRegisterPhone: (phoneNumber) =>
    apiFetch('/user/auth/register/initiate-phone', { method: 'POST', body: { phoneNumber } }),

  resendRegisterPhoneOtp: (phoneNumber) =>
    apiFetch('/user/auth/register/resend-phone-otp', { method: 'POST', body: { phoneNumber } }),

  verifyRegisterPhone: (phoneNumber, otp) =>
    apiFetch('/user/auth/register/verify-phone', { method: 'POST', body: { phoneNumber, otp } }),

  initiateEmail: (sessionId, email, firstName) =>
    apiFetch('/user/auth/register/initiate-email-otp', {
      method: 'POST',
      body: { sessionId, email, firstName },
    }),

  resendEmail: (sessionId, email, firstName) =>
    apiFetch('/user/auth/register/resend-email-otp', {
      method: 'POST',
      body: { sessionId, email, firstName },
    }),

  verifyEmail: (sessionId, email, otp) =>
    apiFetch('/user/auth/register/verify-email-otp', {
      method: 'POST',
      body: { sessionId, email, otp },
    }),

  completeRegistration: (payload) =>
    apiFetch('/user/auth/register/complete', { method: 'POST', body: payload }),

  getMe: (token) =>
    apiFetch('/user/auth/me', { token }),

  updateMe: (payload, token) =>
    apiFetch('/user/auth/me', { method: 'PUT', body: payload, token }),

  logout: (refreshToken, token) =>
    apiFetch('/user/auth/logout', { method: 'POST', body: { refreshToken }, token }),

  refreshTokens: (refreshToken) =>
    apiFetch('/user/auth/refresh', { method: 'POST', body: { refreshToken } }),
};

/* ---- Reviews ---- */

export const reviewsApi = {
  /**
   * GET /api/products/:productId/reviews?page=1&limit=5
   * Public — no auth needed.
   */
  getReviews: (productId, page = 1, limit = 5) =>
    apiFetch(`/products/${productId}/reviews?page=${page}&limit=${limit}`),

  /**
   * POST /api/products/:productId/reviews
   * Auth required.
   * Body: { rating, title, comment?, images? }
   */
  createReview: (productId, payload, token) =>
    apiFetch(`/products/${productId}/reviews`, { method: 'POST', body: payload, token }),
};
