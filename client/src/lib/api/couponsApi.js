import { apiRequest } from "../apiClient";

export const couponsApi = {
  // Validate coupon (auth required)
  validateCoupon: (code, orderTotal) =>
    apiRequest("/coupons/validate", {
      method: "POST",
      body: { code, orderTotal },
      auth: true,
    }),
};
