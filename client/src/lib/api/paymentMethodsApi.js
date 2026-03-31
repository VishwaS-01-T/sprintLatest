import { apiRequest } from "../apiClient";

export const paymentMethodsApi = {
  list: () => apiRequest("/payment-methods", { auth: true }),
  create: (payload) =>
    apiRequest("/payment-methods", {
      method: "POST",
      auth: true,
      body: payload,
    }),
  remove: (paymentMethodId) =>
    apiRequest(`/payment-methods/${paymentMethodId}`, {
      method: "DELETE",
      auth: true,
    }),
  setDefault: (paymentMethodId) =>
    apiRequest(`/payment-methods/${paymentMethodId}/default`, {
      method: "PATCH",
      auth: true,
    }),
};
