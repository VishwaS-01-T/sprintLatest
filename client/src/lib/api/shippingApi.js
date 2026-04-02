import { apiRequest } from "../apiClient";

export const shippingApi = {
  // Get available shipping methods (public)
  getMethods: () => apiRequest("/shipping/methods"),

  // Calculate shipping cost (public)
  calculateShipping: (payload) =>
    apiRequest("/shipping/calculate", {
      method: "POST",
      body: payload,
    }),
};
