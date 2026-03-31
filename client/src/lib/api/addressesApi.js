import { apiRequest } from "../apiClient";

export const addressesApi = {
  list: () => apiRequest("/user/addresses", { auth: true }),
  get: (addressId) => apiRequest(`/user/addresses/${addressId}`, { auth: true }),
  create: (payload) => apiRequest("/user/addresses", { method: "POST", auth: true, body: payload }),
  update: (addressId, payload) =>
    apiRequest(`/user/addresses/${addressId}`, {
      method: "PATCH",
      auth: true,
      body: payload,
    }),
  remove: (addressId) =>
    apiRequest(`/user/addresses/${addressId}`, { method: "DELETE", auth: true }),
  setDefaultShipping: (addressId) =>
    apiRequest(`/user/addresses/${addressId}/set-default-shipping`, {
      method: "PATCH",
      auth: true,
    }),
  setDefaultBilling: (addressId) =>
    apiRequest(`/user/addresses/${addressId}/set-default-billing`, {
      method: "PATCH",
      auth: true,
    }),
};
