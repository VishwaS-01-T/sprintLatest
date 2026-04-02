import { apiRequest } from "../apiClient";

export const paymentsApi = {
  /**
   * Create a Razorpay order for payment
   * POST /payments/create-order
   */
  createOrder: (paymentId) =>
    apiRequest("/payments/create-order", {
      method: "POST",
      auth: true,
      body: { paymentId },
    }),

  /**
   * Verify payment after Razorpay checkout completion
   * POST /payments/verify
   */
  verifyPayment: (payload) =>
    apiRequest("/payments/verify", {
      method: "POST",
      auth: true,
      body: payload,
    }),

  /**
   * Get payment details
   * GET /payments/:paymentId
   */
  getPayment: (paymentId) =>
    apiRequest(`/payments/${paymentId}`, { auth: true }),
};
