import { apiRequest } from "../apiClient";

export const returnsApi = {
  create: (payload) => apiRequest("/returns", { method: "POST", auth: true, body: payload }),
  list: ({ page = 1, limit = 10 } = {}) =>
    apiRequest(`/returns?page=${page}&limit=${limit}`, { auth: true }),
  get: (returnId) => apiRequest(`/returns/${returnId}`, { auth: true }),
  cancel: (returnId) => apiRequest(`/returns/${returnId}/cancel`, { method: "PATCH", auth: true }),
  timeline: (returnId) => apiRequest(`/returns/${returnId}/timeline`, { auth: true }),
  reasons: () => apiRequest("/returns/reasons", { auth: true }),
};
